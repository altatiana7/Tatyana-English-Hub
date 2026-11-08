/* Culture Shock · B1 — весь контент урока в одном файле.
   Урок написан с нуля по мотивам описания темы Culture Shock (B1):
   три истории (Канада, Корея, Германия), лексика, аудирование, диалоги,
   сценарии. Никаких чужих PDF и текстов — только собственный материал. */

window.CULTURE_SHOCK = {
  meta: {
    title: "Culture Shock",
    subtitle: "Three small things that surprised three very different people",
    level: "B1",
    time: "60 min",
    skills: ["Vocabulary", "Listening", "Speaking", "Writing"],
    author: "Урок для Tatyana English Hub"
  },

  /* ───────────── 1. LEAD-IN ───────────── */
  leadIn: {
    intro: "Culture shock does not always mean pyramids or strange food. For many people it is milk in a bag, a smiling stranger, or a bottle cap that will not come off. In this lesson you will listen to three short stories and see how small details change the way we feel in a new country.",
    questions: [
      {
        q: "Have you ever travelled to another country? What surprised you most?",
        hints: ["Weird", "Proper", "The environment", "To stare"]
      },
      {
        q: "What would you miss about your own country? And what would you like about a foreign city?",
        hints: ["Customs", "Shopping", "Small talk"]
      },
      {
        q: "Have you ever felt like a stranger in your own country? When?",
        hints: ["Culture shock", "To feel out of place"]
      },
      {
        q: "Some people say travelling is easy today. Do you agree?",
        hints: ["The internet", "Translate apps", "English"]
      }
    ]
  },

  /* ───────────── 2. VOCABULARY PREVIEW ───────────── */
  vocabulary: [
    {
      word: "culture shock", icon: "🌍",
      ipa: "/ˈkʌltʃə ʃɒk/",
      pos: "noun",
      meaning: "the feeling of surprise or worry you get in a new culture",
      ru: "культурный шок",
      example: "My first week in Tokyo was a real culture shock.",
      tag: "main idea"
    },
    {
      word: "proper", icon: "✅",
      ipa: "/ˈprɒpə/",
      pos: "adj",
      meaning: "correct, real, the way it should be",
      ru: "правильный, настоящий",
      example: "I couldn’t find a proper cup of tea anywhere."
    },
    {
      word: "weird", icon: "🤨",
      ipa: "/wɪəd/",
      pos: "adj",
      meaning: "strange and difficult to understand",
      ru: "странный",
      example: "Putting milk in a bag is weird if you grew up with cartons."
    },
    {
      word: "to trick", icon: "🎭",
      ipa: "/trɪk/",
      pos: "verb",
      meaning: "to make someone believe something that is not true, usually as a joke",
      ru: "обмануть, разыграть",
      example: "His friends tricked him and said there was a snake in the garden."
    },
    {
      word: "to twist", icon: "🔄",
      ipa: "/twɪst/",
      pos: "verb",
      meaning: "to turn something with your hands; also to hurt a joint (an ankle, a wrist)",
      ru: "крутить; подвернуть (ногу)",
      example: "I tried to twist off the bottle cap and cut my finger."
    },
    {
      word: "cap", icon: "🔵",
      ipa: "/kæp/",
      pos: "noun",
      meaning: "the flat cover that closes a bottle",
      ru: "крышка",
      example: "In Germany the bottle cap is attached to the bottle."
    },
    {
      word: "speed sign", icon: "🛣️",
      ipa: "/ˈspiːd saɪn/",
      pos: "noun",
      meaning: "a road sign that shows how fast you may drive",
      ru: "дорожный знак скорости",
      example: "I did not see any speed signs on the motorway."
    },
    {
      word: "to stare", icon: "👀",
      ipa: "/steə/",
      pos: "verb",
      meaning: "to look at somebody for a long time, without looking away",
      ru: "пристально смотреть",
      example: "People stared at me when I spoke English in the shop."
    },
    {
      word: "the environment", icon: "🌱",
      ipa: "/ði ɪnˈvaɪrənmənt/",
      pos: "noun",
      meaning: "the natural world: air, water, land, animals",
      ru: "окружающая среда",
      example: "Attached caps protect the environment because they do not get lost."
    },
    {
      word: "custom", icon: "🤝",
      ipa: "/ˈkʌstəm/",
      pos: "noun",
      meaning: "something a group of people usually does; a tradition",
      ru: "обычай",
      example: "In some countries it is a custom to leave your shoes at the door."
    }
  ],

  /* ───────────── 3. DEFINITIONS ───────────── */
  definitions: [
    { id: "d1", definition: "strange and difficult to understand", answer: "weird" },
    { id: "d2", definition: "to turn something with your hands", answer: "to twist" },
    { id: "d3", definition: "the flat cover of a bottle", answer: "cap" },
    { id: "d4", definition: "correct, real, the way it should be", answer: "proper" },
    { id: "d5", definition: "to look at somebody for a long time", answer: "to stare" },
    { id: "d6", definition: "the natural world around us", answer: "the environment" },
    { id: "d7", definition: "a sign that shows how fast you may drive", answer: "speed sign" },
    { id: "d8", definition: "to make someone believe something that is not true, as a joke", answer: "to trick" }
  ],

  /* ───────────── 4–6. THREE VIDEO STORIES ───────────── */
  videos: [
    {
      id: "ca",
      country: "Canada",
      flag: "🇨🇦",
      city: "Toronto",
      speaker: "Mark, 24, student",
      headline: "Milk does not come in a box",
      duration: "0:19",
      accent: "Canadian English",
      audio: "audio/ca.mp3",
      image: "img/ca-milk.webp",
      imageAlt: "Photograph: a man in a black winter parka holds a plastic bag of milk in a supermarket aisle, spilled milk on the floor, shelves full of bagged milk behind him",
      transcript: [
        { who: "Mark", text: "Before I moved here, my friends said, “You will have a real culture shock in Canada.”" },
        { who: "Mark", text: "They told me about the food, the hockey, the winter, everything." },
        { who: "Mark", text: "But honestly? The only thing that surprised me was the milk." },
        { who: "Mark", text: "It does not come in a carton. It comes in a plastic bag!" },
        { who: "Mark", text: "The first time I tried to open one, I did it the wrong way and the milk was everywhere." },
        { who: "Mark", text: "My roommate watched me for a minute and then said, “Nobody showed you how to do it, did they?”" },
        { who: "Mark", text: "So maybe culture shock is not about big things. Sometimes it is just a bag of milk." }
      ],
      questions: [
        {
          q: "What did Mark’s friends warn him about?",
          options: [
            "The food, the hockey and the winter",
            "Only the milk",
            "The language at university"
          ],
          answer: 0
        },
        {
          q: "What was the only thing that really surprised him?",
          options: ["The winter", "The milk in a bag", "The cost of transport"],
          answer: 1
        },
        {
          q: "What happened the first time he opened the bag?",
          options: [
            "He drank it all",
            "His roommate opened it for him",
            "He opened it the wrong way and the milk went everywhere"
          ],
          answer: 2
        },
        {
          q: "What is his conclusion?",
          options: [
            "Culture shock is about big things only",
            "Sometimes culture shock is just a bag of milk",
            "People in Canada are unfriendly"
          ],
          answer: 1
        }
      ]
    },
    {
      id: "kr",
      country: "Korea",
      flag: "🇰🇷",
      city: "Seoul",
      speaker: "Ji-woo, 29, designer",
      headline: "Why is everybody smiling at me?",
      duration: "1:11",
      accent: "English with a Korean accent",
      audio: "audio/kr.mp3",
      image: "img/kr-smile.webp",
      imageAlt: "Photograph: a young Korean man with a backpack looks uncomfortable while a friendly stranger in a yellow jacket waves hello on a New York street",
      transcript: [
        { who: "Ji-woo", text: "The first month in America, I had one question every day: why is everybody smiling at me?" },
        { who: "Ji-woo", text: "In Korea, we do not usually smile at strangers. We keep our face calm. It is polite." },
        { who: "Ji-woo", text: "So when a man in the street looked at me and said, “Hey, how are you today?”, I was sure that something was wrong." },
        { who: "Ji-woo", text: "I was sure he wanted something: money, my phone, my time." },
        { who: "Ji-woo", text: "Later my roommate told me the truth. Nobody wants anything! It is just small talk. It is a way of saying, “I see you, and I am not a dangerous person.”" },
        { who: "Ji-woo", text: "And Korean people do the same thing, but in a different way: we offer food. My mother gives food to everybody, even to the postman." },
        { who: "Ji-woo", text: "So we are not cold and Americans are not fake. We just say “hello” with different words." }
      ],
      questions: [
        {
          q: "What question did Ji-woo have every day?",
          options: [
            "Why is the food so sweet?",
            "Why is everybody smiling at me?",
            "Why is everything so far away?"
          ],
          answer: 1
        },
        {
          q: "In Korea, what is polite in the street?",
          options: ["To smile at everybody", "To keep your face calm", "To say hello to every stranger"],
          answer: 1
        },
        {
          q: "What did Ji-woo think when a man said “Hey, how are you today?”",
          options: [
            "That the man wanted something",
            "That the man was a friend of his father",
            "That the man was lost"
          ],
          answer: 0
        },
        {
          q: "How do Korean people show friendliness, according to Ji-woo?",
          options: ["They smile all the time", "They offer food", "They ask a lot of questions"],
          answer: 1
        },
        {
          q: "What is his conclusion?",
          options: [
            "Korean people are cold and Americans are fake",
            "Small talk is a waste of time",
            "We say “hello” with different words"
          ],
          answer: 2
        }
      ]
    },
    {
      id: "de",
      country: "Germany",
      flag: "🇩🇪",
      city: "Berlin",
      speaker: "Lena, 31, nurse",
      headline: "The cap, the motorway and Sunday",
      duration: "1:04",
      accent: "English with a German accent",
      audio: "audio/de.mp3",
      image: "img/de-cap.webp",
      imageAlt: "Photograph: a hand holds a plastic bottle whose cap is attached by a hinge, with a German autobahn and a closed shop with a roller shutter behind",
      transcript: [
        { who: "Lena", text: "Three things surprised me when I moved back to Germany after five years in Britain." },
        { who: "Lena", text: "One: the bottle cap. Here it is attached to the bottle. You twist it and it stays on. It is for the environment — so the caps do not get lost in the street." },
        { who: "Lena", text: "Two: the motorway. I drove for an hour and I did not see a single speed sign. Some parts of the autobahn have no speed limit at all." },
        { who: "Lena", text: "Three: Sunday. On Sunday the shops are closed. Not late, not half-closed — closed. If you forget to buy bread on Saturday, you will have no bread." },
        { who: "Lena", text: "My British friend says these rules are strange. My German mother says they are proper. Maybe we are both right." }
      ],
      questions: [
        {
          q: "Why is the bottle cap attached to the bottle?",
          options: [
            "So it is easier to open",
            "For the environment — so caps are not lost",
            "Because it is cheaper for the company"
          ],
          answer: 1
        },
        {
          q: "What surprised her about the motorway?",
          options: [
            "There are no speed signs, and some parts have no speed limit",
            "It is always empty",
            "It is very slow"
          ],
          answer: 0
        },
        {
          q: "What happens on Sunday in Germany?",
          options: ["Shops open late", "Shops are closed", "Only food shops are closed"],
          answer: 1
        },
        {
          q: "What do her British friend and her German mother think about the rules?",
          options: [
            "Both think they are strange",
            "Both think they are perfect",
            "The friend thinks they are strange, the mother thinks they are proper"
          ],
          answer: 2
        }
      ]
    }
  ],

  /* таблица-сравнение после трёх видео */
  comparison: {
    columns: ["Speaker / country", "What surprised them", "Why it matters"],
    rows: [
      { speaker: "Mark · Canada", what: "Milk comes in a plastic bag", why: "Everyday shopping looks different from home" },
      { speaker: "Ji-woo · Korea / USA", what: "Strangers smile and say hello", why: "Friendliness is a custom, not a character trait" },
      { speaker: "Lena · Germany / Britain", what: "Attached caps, no speed limit, closed Sundays", why: "Rules protect the environment and the week’s rhythm" }
    ]
  },

  /* ───────────── 7. TRUE / FALSE (mix по всем видео) ───────────── */
  trueFalse: [
    { s: "Mark’s friends told him the milk would surprise him most.", answer: false, why: "They warned him about food, hockey and winter — the milk surprised nobody but him." },
    { s: "Mark opened the milk bag correctly the first time.", answer: false, why: "He opened it the wrong way and the milk went everywhere." },
    { s: "In Korea it is polite to keep your face calm in the street.", answer: true, why: "Ji-woo says Koreans do not usually smile at strangers." },
    { s: "Ji-woo decided that Americans are fake.", answer: false, why: "He says “we are not cold and Americans are not fake”." },
    { s: "Korean people sometimes show friendliness by offering food.", answer: true, why: "His mother gives food to everybody, even the postman." },
    { s: "Bottle caps in Germany are attached to the bottle to protect the environment.", answer: true, why: "Lena explains that caps do not get lost in the street." },
    { s: "There are speed signs every kilometre on the German autobahn.", answer: false, why: "She drove for an hour without seeing a single speed sign." },
    { s: "German shops are open on Sunday but close earlier.", answer: false, why: "On Sunday they are closed — not late, not half-closed." },
    { s: "Gift refusal is always polite in every culture.", answer: false, why: "In many cultures you must refuse once or twice before you accept — refusing for real can hurt people." },
    { s: "Culture shock can be caused by very small details.", answer: true, why: "All three stories are about small, practical details." }
  ],

  /* ───────────── 8. DIALOGUES: gap-fill ───────────── */
  dialogues: [
    {
      title: "In the supermarket",
      lines: [
        { who: "Ben", text: "Excuse me, sorry — do you know how to open this? The milk is in a [1] , not a carton." },
        { who: "Sophie", text: "Oh, easy. You do not [2] it. You cut the corner with scissors." },
        { who: "Ben", text: "That is so [3] . I’ve never seen milk like this." },
        { who: "Sophie", text: "And for you, tea in a bag is [4] , I suppose?" },
        { who: "Ben", text: "No, actually! But I still can’t find a [5] cup of coffee anywhere in this city." }
      ],
      gaps: ["bag", "twist", "weird", "strange", "proper"],
      gapsByLine: [["bag"], ["twist"], ["weird"], ["strange", "weird"], ["proper"]],
      bank: ["twist", "bag", "weird", "proper", "strange"]
    },
    {
      title: "On the motorway",
      lines: [
        { who: "Anna", text: "Why are you driving so slowly? Everybody is passing us!" },
        { who: "Klaus", text: "No [1] limit here. But I am British, so I still look for a speed [2] every two minutes." },
        { who: "Anna", text: "And why did you [3] at that truck for so long?" },
        { who: "Klaus", text: "Because in Britain we never see a truck that big. Come on, admit it — this country is a little [4] ." },
        { who: "Anna", text: "It is not weird. It is just different. And it is better for the [5] — that is why the caps stay on the bottles." }
      ],
      gaps: ["speed", "sign", "stare", "weird", "environment"],
      gapsByLine: [["speed"], ["sign"], ["stare"], ["weird", "strange"], ["environment"]],
      bank: ["speed", "sign", "stare", "weird", "environment"]
    }
  ],

  /* ───────────── 9. COLLOCATIONS ───────────── */
  collocations: {
    pairs: [
      { left: "culture", right: "shock", example: "Living abroad gave me a real culture shock." },
      { left: "twist", right: "your ankle", example: "I twisted my ankle on the icy stairs." },
      { left: "protect", right: "the environment", example: "Attached caps protect the environment." },
      { left: "bottle", right: "cap", example: "The bottle cap stayed on the bottle." },
      { left: "speed", right: "limit", example: "Some parts of the autobahn have no speed limit." },
      { left: "proper", right: "cup of tea", example: "After a week in Asia I wanted a proper cup of tea." },
      { left: "small", right: "talk", example: "Small talk with strangers feels strange to some people." },
      { left: "to stare", right: "at somebody", example: "It is rude to stare at people on the metro." },
      { left: "to trick", right: "somebody into something", example: "They tricked me into trying the local speciality." },
      { left: "social", right: "custom", example: "Taking your shoes off at the door is a social custom." }
    ],
    sentences: [
      { text: "It is rude to ____ at people on the metro.", answer: ["stare"], hint: "look for a long time" },
      { text: "Please ____ the cap before you recycle the bottle.", answer: ["twist off", "twist", "unscrew"], hint: "turn it with your hand" },
      { text: "We must ____ the environment for our children.", answer: ["protect"], hint: "keep safe" },
      { text: "In Norway there is a strict ____ limit in the city centre.", answer: ["speed"], hint: "how fast you may drive" },
      { text: "I need a ____ cup of tea after that flight.", answer: ["proper"], hint: "real, the way it should be" },
      { text: "Living in Japan was a real culture ____ for me.", answer: ["shock"], hint: "the feeling of surprise" }
    ]
  },

  /* ───────────── 10. DISCUSSION ───────────── */
  discussion: [
    "The three speakers all say culture shock is about small things. Do you agree? Give an example from your life.",
    "Is it polite to smile at strangers in your culture? What happens if you do?",
    "Which is easier: to adapt to a new culture or to keep your own habits? Why?",
    "Some people say the internet has killed culture shock. Is that true?",
    "What would a foreigner find strange in your country? Make a list of five things.",
    "Is it OK to break a local custom if you do not understand it?"
  ],

  /* ───────────── 11. SCENARIOS (role-play) ───────────── */
  scenarios: [
    {
      title: "The hugging grandma",
      situation: "You are at a family dinner in a new country. The grandmother of the family hugs you and kisses you on both cheeks. In your culture people do not touch strangers. What do you do?",
      useful: ["Thank you, that’s very kind", "I’m sorry, I’m not used to…", "Could we shake hands instead?", "I really appreciate it"],
      tips: "Smile, thank her, and explain your custom politely. Do not pull away without a word."
    },
    {
      title: "The too-honest compliment",
      situation: "Your colleague says: “That jacket is awful. You should wear something else.” She is smiling. You feel hurt. What do you say?",
      useful: ["Thanks for being honest, but…", "In my culture we usually…", "I actually like it", "Did you mean that as a joke?"],
      tips: "Ask a question before you get angry: maybe it is a joke, or maybe it is normal directness in her culture."
    },
    {
      title: "The refused gift",
      situation: "You bring a small gift to your host family. They say, “Oh no, we can’t accept this!” and put it on the table. Do they hate it?",
      useful: ["Please, it’s just a small thing", "I’d be happy if you took it", "Is it not polite here?"],
      tips: "In many cultures you refuse a gift once or twice before accepting it. Offer it again; if they still refuse, leave it with a card."
    },
    {
      title: "The silent neighbour",
      situation: "You greet your neighbour every morning. He only nods and never says a word. You think he dislikes you.",
      useful: ["Morning! Nice weather today", "Is everything OK?", "Just so you know, I’m friendly"],
      tips: "In some cultures a nod is a full greeting. Give it time — and keep saying hello."
    }
  ],

  /* ───────────── 12. WRAP UP ───────────── */
  wrapUp: {
    checklist: [
      "I can talk about culture shock and everyday customs.",
      "I can understand three short stories about cultural differences.",
      "I can use 10 new words: culture shock, proper, weird, to trick, to twist, cap, speed sign, to stare, the environment, custom.",
      "I can use collocations like twist your ankle, protect the environment, bottle cap.",
      "I can react politely to an awkward cross-cultural situation."
    ],
    homework: [
      "Write 5 sentences with the collocations from task 9.",
      "Record a 60-second voice message: “Three things that would surprise a foreigner in my city”.",
      "Optional: watch a short video about culture shock (any country) and tell the group two facts from it."
    ]
  }
};
