import { useRewardedAd } from "react-native-google-mobile-ads";
import { REWARDED_AD_UNIT_ID } from "./adUnitIds";

export function useChatRewardedAd() {
  return useRewardedAd(REWARDED_AD_UNIT_ID);
}
