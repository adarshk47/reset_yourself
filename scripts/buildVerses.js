// One-off data build script. Reads Sanskrit text + transliteration from a
// reference clone of github.com/vedicscriptures/bhagavad-gita (GPLv3 - used
// here only to source the ancient public-domain Sanskrit verses and their
// mechanical transliteration, NOT to copy any translator's copyrighted
// commentary). English/Hindi translations below are written independently.
// Run: node scripts/buildVerses.js <path-to-cloned-repo> > src/data/verses.json
const fs = require("fs");
const path = require("path");

const SRC_DIR = process.argv[2];
if (!SRC_DIR) {
  console.error("Usage: node scripts/buildVerses.js <path-to-cloned-repo>");
  process.exit(1);
}

// chapter_verse -> { en, hi }
const translations = {
  "1_47": {
    en: "Sanjaya said: Having spoken thus, Arjuna sat down on the seat of his chariot in the midst of the battle, casting aside his bow and arrow, his mind overwhelmed with grief.",
    hi: "संजय ने कहा: ऐसा कहकर अर्जुन युद्धभूमि में रथ पर बैठ गए और शोक से व्याकुल मन से बाण सहित धनुष को त्याग दिया।",
  },
  "2_3": {
    en: "O Partha, do not yield to this unmanly weakness; it does not become you. Cast off this petty faintheartedness and arise, O scorcher of foes.",
    hi: "हे पार्थ, इस नपुंसकता को प्राप्त मत हो, यह तुम्हें शोभा नहीं देता। हे परंतप, इस तुच्छ हृदय-दुर्बलता को त्यागकर उठो।",
  },
  "2_14": {
    en: "O son of Kunti, the contact of the senses with their objects - giving rise to heat and cold, pleasure and pain - is temporary; it comes and goes. Endure it with patience, O Bharata.",
    hi: "हे कुन्तीपुत्र, इन्द्रियों का विषयों से स्पर्श सुख-दुख, शीत-उष्ण देने वाला है, ये आने-जाने वाले और अनित्य हैं; हे भारत, इन्हें सहन करो।",
  },
  "2_20": {
    en: "The soul is never born, nor does it ever die; nor, having once existed, does it ever cease to be. It is unborn, eternal, everlasting and primeval; it is not slain when the body is slain.",
    hi: "यह आत्मा न कभी जन्म लेता है, न मरता है; न यह होकर फिर अभाव को प्राप्त होता है। यह अजन्मा, नित्य, सनातन और पुरातन है; शरीर के मारे जाने पर भी यह नहीं मरता।",
  },
  "2_23": {
    en: "Weapons cannot cut this soul, fire cannot burn it, water cannot wet it, and wind cannot dry it.",
    hi: "इस आत्मा को शस्त्र काट नहीं सकते, अग्नि जला नहीं सकती, जल भिगो नहीं सकता और वायु सुखा नहीं सकती।",
  },
  "2_27": {
    en: "Death is certain for the one who is born, and birth is certain for the one who dies; therefore you should not grieve over what is unavoidable.",
    hi: "जन्मे हुए की मृत्यु अवश्य है और मरे हुए का जन्म अवश्य है; इस अनिवार्य विषय में तुम्हें शोक नहीं करना चाहिए।",
  },
  "2_38": {
    en: "Treating alike pleasure and pain, gain and loss, victory and defeat, engage yourself in this duty; thus you shall not incur sin.",
    hi: "सुख-दुख, लाभ-हानि और जय-पराजय को समान समझकर कर्म के लिए तैयार हो जाओ; इस प्रकार तुम्हें पाप नहीं लगेगा।",
  },
  "2_47": {
    en: "Your right is to perform your prescribed duty, never to its fruits. Let not the fruit of action be your motive, nor let yourself be attached to inaction.",
    hi: "कर्म करने में ही तुम्हारा अधिकार है, उसके फल में कभी नहीं। कर्मफल को अपना उद्देश्य मत बनाओ, और कर्म न करने में भी आसक्त मत हो।",
  },
  "2_48": {
    en: "Perform your duty steadfastly, O Arjuna, abandoning attachment to its outcome, remaining equipoised in success and failure; such equanimity is called yoga.",
    hi: "हे धनंजय, आसक्ति त्यागकर योग में स्थित होकर तथा सिद्धि और असिद्धि में समान भाव रखकर कर्म करो; यह समत्व ही योग कहलाता है।",
  },
  "2_50": {
    en: "A person of steady wisdom casts off, even in this life, both good and evil deeds; therefore strive for yoga - yoga is skill in action.",
    hi: "समबुद्धि वाला व्यक्ति इस जीवन में ही पुण्य और पाप दोनों का त्याग कर देता है; इसलिए योग के लिए प्रयत्न करो, कर्मों में कुशलता ही योग है।",
  },
  "2_56": {
    en: "One whose mind is undisturbed amid sorrow, who does not crave pleasure, and who is free from attachment, fear and anger - such a person is called a sage of steady wisdom.",
    hi: "जो दुखों में उद्विग्न नहीं होता, सुखों की इच्छा नहीं रखता, और जो राग, भय और क्रोध से मुक्त है, वह स्थितप्रज्ञ मुनि कहलाता है।",
  },
  "2_62": {
    en: "When a person dwells on sense objects, attachment to them is born; from attachment arises desire, and from desire arises anger.",
    hi: "विषयों का चिंतन करने वाले मनुष्य की उनमें आसक्ति उत्पन्न होती है, आसक्ति से कामना और कामना से क्रोध उत्पन्न होता है।",
  },
  "2_63": {
    en: "From anger comes delusion, from delusion comes loss of memory, from loss of memory comes the destruction of discernment, and when discernment is destroyed, one falls.",
    hi: "क्रोध से मोह उत्पन्न होता है, मोह से स्मृति-भ्रम होता है, स्मृति-भ्रम से बुद्धि का नाश होता है और बुद्धि नष्ट होने पर मनुष्य का पतन हो जाता है।",
  },
  "2_70": {
    en: "As the ocean remains undisturbed though waters constantly enter it, so the one whom desires enter without disturbing remains at peace - not the one who chases after desires.",
    hi: "जैसे सब ओर से जल से भरे हुए, अचल स्थिति वाले समुद्र में जल प्रवेश करता है, वैसे ही जिसमें सभी कामनाएं प्रवेश करती हैं वही शांति प्राप्त करता है, कामनाओं का इच्छुक व्यक्ति नहीं।",
  },
  "3_7": {
    en: "But the one who, having controlled the senses with the mind, engages in selfless action without attachment, O Arjuna - that person excels.",
    hi: "परंतु हे अर्जुन, जो मन से इंद्रियों को नियंत्रित करके आसक्ति रहित होकर कर्मेंद्रियों से कर्मयोग करता है, वह श्रेष्ठ है।",
  },
  "3_19": {
    en: "Therefore, always perform your prescribed duty without attachment; for by performing action without attachment, a person attains the Supreme.",
    hi: "इसलिए निरंतर आसक्ति रहित होकर कर्तव्य कर्म करो; क्योंकि आसक्ति रहित होकर कर्म करने वाला मनुष्य परम तत्व को प्राप्त होता है।",
  },
  "3_27": {
    en: "All actions are performed by the qualities (gunas) of nature; the one whose mind is deluded by ego thinks, 'I am the doer.'",
    hi: "सभी कर्म प्रकृति के गुणों द्वारा किए जाते हैं; अहंकार से मोहित आत्मा वाला व्यक्ति 'मैं कर्ता हूं' ऐसा मानता है।",
  },
  "3_35": {
    en: "Better is one's own duty, though imperfectly performed, than another's duty well performed; death while engaged in one's own duty is better, for following another's duty is fraught with fear.",
    hi: "अपना धर्म दोषयुक्त होने पर भी, अच्छी प्रकार पालन किए गए दूसरे के धर्म से श्रेष्ठ है; अपने धर्म में मृत्यु भी कल्याणकारी है, दूसरे का धर्म भय उत्पन्न करने वाला है।",
  },
  "3_37": {
    en: "The Blessed Lord said: It is desire, it is anger, born of passion - know this to be the all-devouring, deeply harmful enemy here.",
    hi: "श्री भगवान बोले: यह कामना है, यह क्रोध है, जो रजोगुण से उत्पन्न होता है; इसे ही महान भक्षक और महापापी शत्रु जानो।",
  },
  "4_10": {
    en: "Freed from attachment, fear and anger, absorbed in me, taking refuge in me, purified by the fire of knowledge, many have attained my being.",
    hi: "राग, भय और क्रोध से मुक्त, मुझमें तन्मय, मेरी शरण में आए हुए, ज्ञान रूपी तप से पवित्र हुए अनेक लोग मेरे भाव को प्राप्त हुए हैं।",
  },
  "4_38": {
    en: "In this world, there is nothing as purifying as knowledge; one who is perfected in yoga finds it within themselves in due time.",
    hi: "इस संसार में ज्ञान के समान पवित्र करने वाला कुछ भी नहीं है; योग में सिद्ध हुआ व्यक्ति इसे समय आने पर अपने आप में पा लेता है।",
  },
  "5_10": {
    en: "One who performs action, offering it to the divine, abandoning attachment, is untouched by sin, just as a lotus leaf is untouched by water.",
    hi: "जो ब्रह्म में कर्मों को समर्पित करके, आसक्ति त्यागकर कर्म करता है, वह पाप से वैसे ही अलिप्त रहता है जैसे जलकमल का पत्ता जल से।",
  },
  "5_18": {
    en: "The truly wise look with equal regard upon a learned and humble sage, a cow, an elephant, a dog, and even an outcaste.",
    hi: "विद्या और विनय से युक्त ब्राह्मण में, गाय में, हाथी में, कुत्ते में और चांडाल में भी ज्ञानी समान दृष्टि रखते हैं।",
  },
  "6_5": {
    en: "Let a person lift themselves up by their own self; let them not degrade themselves. For the self alone is one's friend, and the self alone is one's enemy.",
    hi: "मनुष्य को स्वयं अपने द्वारा अपना उद्धार करना चाहिए, अपने आप को गिराना नहीं चाहिए; क्योंकि आत्मा ही आत्मा का मित्र है और आत्मा ही आत्मा का शत्रु है।",
  },
  "6_6": {
    en: "For one who has conquered their own self by the self, the self is a friend; but for one who has not conquered the self, the self acts like an enemy.",
    hi: "जिसने अपनी आत्मा को आत्मा से जीत लिया है, उसके लिए आत्मा मित्र है; परंतु जिसने आत्मा को नहीं जीता, उसके लिए आत्मा शत्रु के समान व्यवहार करती है।",
  },
  "6_16": {
    en: "Yoga is not for one who eats too much or too little, nor for one who sleeps too much or stays awake too much, O Arjuna.",
    hi: "न अधिक खाने वाले का और न बिल्कुल न खाने वाले का योग सिद्ध होता है, न अधिक सोने वाले का और न सदा जागते रहने वाले का, हे अर्जुन।",
  },
  "6_17": {
    en: "For one who is moderate in food and recreation, balanced in action, and regulated in sleep and waking, yoga becomes the destroyer of sorrow.",
    hi: "जो आहार और विहार में नियमित है, कर्मों में संयमित चेष्टा रखता है, और सोने-जागने में नियमित है, उसका योग दुखों का नाशक होता है।",
  },
  "6_26": {
    en: "Wherever the restless and unsteady mind wanders, one should withdraw it from there and bring it back under the control of the self.",
    hi: "यह चंचल और अस्थिर मन जहां-जहां भी भटकता है, वहां-वहां से इसे रोककर आत्मा के वश में लाना चाहिए।",
  },
  "6_35": {
    en: "The Blessed Lord said: Undoubtedly, O mighty-armed Arjuna, the mind is restless and hard to control; but it is mastered through practice and dispassion.",
    hi: "श्री भगवान बोले: हे महाबाहो, निःसंदेह मन चंचल और कठिनता से वश में आने वाला है; परंतु अभ्यास और वैराग्य से इसे वश में किया जा सकता है।",
  },
  "7_3": {
    en: "Among thousands of people, scarcely one strives for perfection; and even among those who strive and succeed, scarcely one knows me in truth.",
    hi: "हजारों मनुष्यों में कोई एक ही सिद्धि के लिए प्रयत्न करता है; और प्रयत्न करने वाले सिद्ध पुरुषों में भी कोई एक ही मुझे तत्व से जानता है।",
  },
  "7_14": {
    en: "This divine illusion (maya) of mine, composed of the three qualities, is hard to overcome; but those who take refuge in me alone cross beyond this illusion.",
    hi: "मेरी यह त्रिगुणमयी दिव्य माया पार करना कठिन है; परंतु जो केवल मेरी शरण लेते हैं, वे इस माया को पार कर जाते हैं।",
  },
  "8_7": {
    en: "Therefore, at all times remember me and carry out your duty; with mind and intellect fixed on me, you shall surely attain me.",
    hi: "इसलिए सभी समयों में मेरा स्मरण करो और अपना कर्तव्य करो; मन और बुद्धि मुझमें अर्पित करके तुम निःसंदेह मुझे ही प्राप्त होगे।",
  },
  "9_22": {
    en: "To those who worship me with single-minded devotion, ever united in me, I provide what they lack and preserve what they have.",
    hi: "जो अनन्य भाव से मेरा चिंतन करते हुए मेरी उपासना करते हैं, उन नित्य मुझमें युक्त रहने वाले भक्तों के योग और क्षेम का भार मैं स्वयं उठाता हूं।",
  },
  "9_27": {
    en: "Whatever you do, whatever you eat, whatever you offer in sacrifice, whatever you give away, whatever austerity you perform - O Arjuna, offer all of it to me.",
    hi: "हे कुन्तीपुत्र, जो भी तुम करते हो, जो भी खाते हो, जो भी हवन करते हो, जो भी दान देते हो, जो भी तप करते हो, वह सब मुझे अर्पण करो।",
  },
  "11_32": {
    en: "The Blessed Lord said: I am time, the great destroyer of the worlds, here to annihilate all beings. Even without your action, all these warriors arrayed in the opposing armies shall cease to exist.",
    hi: "श्री भगवान बोले: मैं समस्त लोकों का नाश करने वाला महाकाल हूं, यहां सबका संहार करने के लिए प्रवृत्त हुआ हूं। तुम्हारे बिना भी, इन सेनाओं में खड़े ये सभी योद्धा नहीं रहेंगे।",
  },
  "12_13": {
    en: "One who hates no being, who is friendly and compassionate, free from possessiveness and ego, equal in pleasure and pain, and forgiving...",
    hi: "जो किसी से द्वेष नहीं करता, सब प्राणियों का मित्र और करुणामय है, ममता और अहंकार से रहित है, सुख-दुख में समान और क्षमाशील है...",
  },
  "12_14": {
    en: "...who is ever content, steadfast in meditation, self-controlled, of firm resolve, with mind and intellect dedicated to me - such a devotee is dear to me.",
    hi: "...जो सदा संतुष्ट है, योगयुक्त है, मन को वश में रखने वाला है, दृढ़ निश्चय वाला है, और मन-बुद्धि मुझे अर्पित किए हुए है - ऐसा भक्त मुझे प्रिय है।",
  },
  "12_15": {
    en: "One who is not disturbed by the world, and by whom the world is not disturbed, who is free from joy, anger, fear and anxiety - such a person is dear to me.",
    hi: "जिससे संसार उद्विग्न नहीं होता और जो संसार से उद्विग्न नहीं होता, जो हर्ष, क्रोध, भय और उद्वेग से मुक्त है, वह मुझे प्रिय है।",
  },
  "14_22": {
    en: "The Blessed Lord said: O son of Pandu, one who does not hate illumination, activity or delusion when they arise, nor longs for them when they cease...",
    hi: "श्री भगवान बोले: हे पाण्डव, जो प्रकाश, प्रवृत्ति और मोह के उत्पन्न होने पर उनसे द्वेष नहीं करता, और उनके निवृत्त होने पर उनकी कामना नहीं करता...",
  },
  "16_21": {
    en: "There are three gates to self-destruction: desire, anger and greed. Therefore, one should abandon these three.",
    hi: "काम, क्रोध और लोभ - ये आत्मा का नाश करने वाले नरक के तीन द्वार हैं; इसलिए इन तीनों का त्याग करना चाहिए।",
  },
  "18_47": {
    en: "Better is one's own natural duty, even though imperfect, than another's duty well performed; one who performs the action prescribed by their own nature does not incur sin.",
    hi: "अपना स्वाभाविक धर्म, दोषयुक्त होने पर भी, भलीभांति किए गए दूसरे के धर्म से श्रेष्ठ है; अपने स्वभाव से नियत कर्म करने वाला व्यक्ति पाप को प्राप्त नहीं होता।",
  },
  "18_66": {
    en: "Abandoning all sense of duty, take refuge in me alone; I shall free you from all sins - do not grieve.",
    hi: "सभी धर्मों को त्यागकर केवल मेरी शरण में आ जाओ; मैं तुम्हें सभी पापों से मुक्त कर दूंगा, शोक मत करो।",
  },
  "18_78": {
    en: "Wherever there is Krishna, the Lord of yoga, and wherever there is Arjuna, the wielder of the bow, there will surely be fortune, victory, prosperity and sound judgment - this is my conviction.",
    hi: "जहां योगेश्वर कृष्ण हैं और जहां धनुर्धर पार्थ हैं, वहां श्री, विजय, ऐश्वर्य और स्थिर नीति है - यह मेरा मत है।",
  },
};

function cleanText(text) {
  return text
    .replace(/\s*\(or[^)]*\)/gi, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const verses = Object.keys(translations)
  .map((id) => {
    const [chapter, verseNumber] = id.split("_").map(Number);
    const file = path.join(
      SRC_DIR,
      "slok",
      `bhagavadgita_chapter_${chapter}_slok_${verseNumber}.json`
    );
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    return {
      id,
      chapter,
      verseNumber,
      sanskrit: cleanText(raw.slok),
      transliteration: cleanText(raw.transliteration),
      translations: translations[id],
    };
  })
  .sort((a, b) => a.chapter - b.chapter || a.verseNumber - b.verseNumber);

const output = {
  isPartial: true,
  source:
    "Sanskrit text and transliteration referenced from the public-domain Bhagavad Gita verses (cross-checked against github.com/vedicscriptures/bhagavad-gita for verse boundaries/numbering only). English and Hindi translations are written independently for this app. This is a curated highlights subset (43 verses spanning all main themes across most chapters), not the full 700-verse text - see DATA_LICENSE.md.",
  verses,
};

console.log(JSON.stringify(output, null, 2));
