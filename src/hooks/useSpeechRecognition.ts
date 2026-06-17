import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export interface SpeechRecognitionState {
  isAvailable: boolean;
  isListening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  error: string | null;
}

const RUNNING_IN_EXPO_GO = Constants.appOwnership === "expo";

export function useSpeechRecognition(): SpeechRecognitionState {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAvailable] = useState<boolean>(() => {
    if (RUNNING_IN_EXPO_GO) {
      return false;
    }
    try {
      return ExpoSpeechRecognitionModule.isRecognitionAvailable();
    } catch {
      return false;
    }
  });

  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
    setError(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results[0]?.transcript;
    if (text) {
      setTranscript(text);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    setError(event.message ?? event.error);
    setIsListening(false);
  });

  const start = useCallback(() => {
    if (!isAvailable) {
      setError("Speech recognition is not available in this build.");
      return;
    }
    setTranscript("");
    setError(null);
    ExpoSpeechRecognitionModule.requestPermissionsAsync()
      .then((result) => {
        if (!result.granted) {
          setError("Microphone permission was denied.");
          return;
        }
        ExpoSpeechRecognitionModule.start({
          lang: "en-US",
          interimResults: true,
          continuous: false,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to start listening.");
      });
  }, []);

  const stop = useCallback(() => {
    if (isAvailable) {
      ExpoSpeechRecognitionModule.stop();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (isAvailable) {
        ExpoSpeechRecognitionModule.abort();
      }
    };
  }, []);

  return {
    isAvailable: isAvailable,
    isListening,
    transcript,
    start,
    stop,
    error,
  };
}
