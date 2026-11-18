export const DEFAULT_MOTIVATIONAL_QUOTES = {
  tier_1: [ // 0% - 19%
    {
      ar: "مش مهم بدأت بكام، المهم إنك بدأت. بكرة عندك فرصة جديدة وخطوة أولى بتفرق. 🌿",
      en: "It doesn't matter how small the start is, what matters is showing up. Tomorrow is a fresh start. 🌿"
    },
    {
      ar: "كل رحلة عظيمة بتبدأ بخطوة هادية. استرح واستعد ليوم أفضل. ☕",
      en: "Every great journey begins with a calm step. Rest well and prepare for tomorrow. ☕"
    },
    {
      ar: "الأيام الصعبة بتمر، المهم تظل رحيم بنفسك ومستمر في المحاولة. 🤍",
      en: "Tough days pass. Be kind to yourself and keep the momentum alive. 🤍"
    }
  ],
  tier_2: [ // 20% - 39%
    {
      ar: "اليوم كان تقيل شوية، بس لسه في تقدم. متستهونش بالخطوات الصغيرة أبداً. 🌱",
      en: "Today was a bit heavy, but progress was made. Never underestimate small steps. 🌱"
    },
    {
      ar: "الإنجاز الجزئي أفضل بمليون مرة من عدم المحاولة. كمل بهدوء. 🚶‍♂️",
      en: "Partial progress is infinitely better than zero. Keep moving forward gently. 🚶‍♂️"
    },
    {
      ar: "بنيت نقطة بداية ليومك، والخطوة اللي عملتها النهارده هتسهل عليك بكرة. ✨",
      en: "You created a starting point today; every little effort counts for tomorrow. ✨"
    }
  ],
  tier_3: [ // 40% - 59%
    {
      ar: "كويس جدًا، بدأت تبني إيقاع حقيقي. حاول بكرة تكمل خطوة كمان في الجوانب التانية. 🪴",
      en: "Very good! You're building a steady rhythm. Try to push one step further tomorrow. 🪴"
    },
    {
      ar: "نصف المسافة تم قطعها بوعي. توازن جميل وتدرج ممتاز. ⚖️",
      en: "Half the distance covered mindfully. A solid, balanced effort today. ⚖️"
    },
    {
      ar: "أنت في منطقة التوازن والتقدم المستمر. يوم مليان خطوات حقيقية. 🍃",
      en: "You are in the zone of sustainable growth. Real, steady steps. 🍃"
    }
  ],
  tier_4: [ // 60% - 79%
    {
      ar: "أداء جميل ومتزن 👏 أنت ماشي في الاتجاه الصح وبتبني عادات تدوم.",
      en: "Beautiful and balanced performance 👏 You are heading in the right direction."
    },
    {
      ar: "أغلب جوانب يومك أخذت حقها واهتمامك. استمرارية واعية وراقية! 🌟",
      en: "Most aspects of your day received mindful care. Solid and graceful consistency! 🌟"
    },
    {
      ar: "مستوى رائع من التركيز والإنجاز. فخور بجهدك والتزامك اليوم. 🌿",
      en: "Great level of focus and execution. Proud of your commitment today. 🌿"
    }
  ],
  tier_5: [ // 80% - 94%
    {
      ar: "يوم قوي جدًا ومثمر 🔥 الاستمرارية بالروح دي هي اللي بتغير الحياة تماماً.",
      en: "A very strong and fruitful day 🔥 This level of consistency truly shapes lives."
    },
    {
      ar: "إنجاز عالي مع الحفاظ على التوازن. قربت تقفل اليوم بأعلى درجة كفاءة! 💫",
      en: "High achievement while keeping life balanced. Incredible dedication! 💫"
    },
    {
      ar: "طاقة ممتازة وانضباط حقيقي. واصل على هذا النمط الملهم. 🏔️",
      en: "Superb energy and genuine discipline. Keep up this inspiring pace. 🏔️"
    }
  ],
  tier_6: [ // 95% - 100%
    {
      ar: "يوم استثنائي ومتقن! 👏 حافظ على الاستمرارية، وافتكر إن مش لازم كل يوم يكون 100% عشان تنجح.",
      en: "An extraordinary, masterful day! 👏 Celebrate your focus, and remember perfection isn't required every day."
    },
    {
      ar: "علامة كاملة في الانضباط الذاتي اليوم! استمتع براحتك الليلة بكل هدوء واعتزاز. 🏆",
      en: "Full marks in self-discipline today! Enjoy your evening with peace and pride. 🏆"
    },
    {
      ar: "إنجاز متكامل شمل الصحة، العائلة، الدراسة والتعلم. يوم يُحتذى به! 🌟✨",
      en: "Holistic achievement across health, family, university and learning. Exemplary day! 🌟✨"
    }
  ]
};

export const INITIAL_SECTIONS = [
  {
    id: 'sec-health',
    title: { ar: 'الصحة والرياضة', en: 'Health & Fitness' },
    description: { ar: 'تنشيف العضلات، تحسين وضعية الظهر، واللياقة', en: 'Muscle tone, posture alignment & physical endurance' },
    icon: 'Activity',
    color: 'sage',
    active: true,
    order: 0,
    tasks: [
      {
        id: 'task-health-1',
        title: { ar: '30 دقيقة رياضة وتمارين بدنية', en: '30 Minutes Exercise & Workout' },
        description: { ar: 'تمرين المقاومة أو الكارديو اليومي', en: 'Daily resistance or cardio training' },
        progressPercentage: 0
      },
      {
        id: 'task-health-2',
        title: { ar: 'تمارين فرد وتحسين وضعية الضهر', en: 'Posture Alignment & Stretching' },
        description: { ar: 'ستريتشينج وإطالات لتقوية عضلات الظهر', en: 'Back stretches and posture improvement' },
        progressPercentage: 0
      },
      {
        id: 'task-health-3',
        title: { ar: 'شرب ماء كافٍ وتغذية صحية متوازنة', en: 'Hydration & Clean Nutrition' },
        description: { ar: '3 لتر ماء ووجبات نظيفة', en: '3L water and balanced whole food meals' },
        progressPercentage: 0
      }
    ]
  },
  {
    id: 'sec-family',
    title: { ar: 'العائلة والبيت', en: 'Family & Home' },
    description: { ar: 'الحفاظ على وقت يومي دافئ وحضور حقيقي مع العيلة', en: 'Mindful quality time and deep connection with family' },
    icon: 'Heart',
    color: 'terracotta',
    active: true,
    order: 1,
    tasks: [
      {
        id: 'task-family-1',
        title: { ar: 'نص ساعة بليل مع العيلة', en: 'Spend 30 minutes with family at night' },
        description: { ar: 'جلسة هادية بدون هواتف وتواصل حقيقي', en: 'Uninterrupted presence and meaningful conversation' },
        progressPercentage: 0
      },
      {
        id: 'task-family-2',
        title: { ar: 'المساعدة في البيت وقضاء الاحتياجات', en: 'Help at home and support family needs' },
        description: { ar: 'مشاركة إيجابية ودعم يومي', en: 'Active contribution and daily household support' },
        progressPercentage: 0
      }
    ]
  },
  {
    id: 'sec-university',
    title: { ar: 'الجامعة والدراسة', en: 'University & Academics' },
    description: { ar: 'عدم تضييع أي محاضرة، والمتابعة الأكاديمية المستمرة', en: 'Consistent lecture attendance, review, and summarization' },
    icon: 'GraduationCap',
    color: 'slate',
    active: true,
    order: 2,
    tasks: [
      {
        id: 'task-uni-1',
        title: { ar: 'حضور ومتابعة المحاضرات', en: 'Attend and engage with daily lectures' },
        description: { ar: 'التركيز التام وتسجيل النقاط المهمة', en: 'Complete attention and key takeaways' },
        progressPercentage: 0
      },
      {
        id: 'task-uni-2',
        title: { ar: 'مذاكرة ومراجعة محتوى اليوم', en: 'Study & review today\'s lecture content' },
        description: { ar: 'تثبيت المعلومات قبل تراكمها', en: 'Consolidate concepts immediately' },
        progressPercentage: 0
      },
      {
        id: 'task-uni-3',
        title: { ar: 'تلخيص المحاضرات وحل التطبيقات', en: 'Summarize lectures & solve exercises' },
        description: { ar: 'ملخص منظم وتطبيقات عملية', en: 'Structured summaries and practical problem solving' },
        progressPercentage: 0
      }
    ]
  },
  {
    id: 'sec-english',
    title: { ar: 'تطوير الإنجليزية', en: 'English Growth' },
    description: { ar: 'تحسين الطلاقة والمحادثة اليومية والاستماع', en: 'Daily spoken conversation, fluency and listening practice' },
    icon: 'Languages',
    color: 'ochre',
    active: true,
    order: 3,
    tasks: [
      {
        id: 'task-eng-1',
        title: { ar: '15 دقيقة محادثة باللغة الإنجليزية', en: '15 Minutes English Conversation' },
        description: { ar: 'تحدث بصوت عالٍ أو مع شريك تدريب', en: 'Speaking practice or conversational drills' },
        progressPercentage: 0
      },
      {
        id: 'task-eng-2',
        title: { ar: 'استماع لبودكاست أو قراءة مقال إنجليزي', en: 'English Podcast or Article Reading (15 min)' },
        description: { ar: 'اكتساب مصطلحات جديدة في سياق واقعي', en: 'Acquiring vocabulary through active listening' },
        progressPercentage: 0
      }
    ]
  },
  {
    id: 'sec-vacation',
    title: { ar: 'أيام الإجازة والتعلم الإضافي', en: 'Weekend & Deep Learning' },
    description: { ar: 'محاضرات إنجليزية مكثفة وتطوير مهارات الـ Backend', en: 'Intensive English lectures & dedicated Backend development' },
    icon: 'Code',
    color: 'plum',
    active: true,
    order: 4,
    isVacationSection: true,
    tasks: [
      {
        id: 'task-vac-1',
        title: { ar: 'ساعتان محاضرة إنجليزي مكثفة (2h English Lecture)', en: '2 Hours English Lecture & Deep Study' },
        description: { ar: 'استماع وتحليل كورس أو محاضرة أكاديمية', en: 'In-depth lecture analysis and note-taking' },
        progressPercentage: 0
      },
      {
        id: 'task-vac-2',
        title: { ar: 'ساعتان تعلم وتطبيق Backend Development (2h Backend)', en: '2 Hours Backend Development & Building' },
        description: { ar: 'بناء مشاريع، قواعد بيانات، وAPIs', en: 'Hands-on server-side architecture, APIs and DBs' },
        progressPercentage: 0
      }
    ]
  }
];

export const DEFAULT_SETTINGS = {
  language: 'ar', // 'ar' | 'en'
  theme: 'light', // 'light' | 'dark' | 'system'
  weekendDays: [5, 6], // Friday (5) & Saturday (6)
  enableSounds: true,
  autoSeedPastSampleDays: false,
};

export const COLOR_MAP = {
  sage: {
    accent: '#3D7D45',
    accentBg: '#E8F5EA',
    accentBorder: '#A5D0A9',
    accentColor: '#214D27',
    gradient: 'linear-gradient(90deg, #519A58, #3D7D45)',
    ring: 'stroke-emerald-600',
  },
  terracotta: {
    accent: '#A86344',
    accentBg: '#FBF0EB',
    accentBorder: '#E8BDAA',
    accentColor: '#7A3F2A',
    gradient: 'linear-gradient(90deg, #C27A5A, #A86344)',
    ring: 'stroke-rose-600',
  },
  slate: {
    accent: '#3878A8',
    accentBg: '#EBF3FA',
    accentBorder: '#96C0E0',
    accentColor: '#1C4870',
    gradient: 'linear-gradient(90deg, #5599C5, #3878A8)',
    ring: 'stroke-sky-600',
  },
  ochre: {
    accent: '#B87808',
    accentBg: '#FDF3E0',
    accentBorder: '#E8C878',
    accentColor: '#7A4E04',
    gradient: 'linear-gradient(90deg, #D4A020, #B87808)',
    ring: 'stroke-amber-600',
  },
  plum: {
    accent: '#7845A8',
    accentBg: '#F4EEFA',
    accentBorder: '#C8A0E8',
    accentColor: '#4A2068',
    gradient: 'linear-gradient(90deg, #9E6DC5, #7845A8)',
    ring: 'stroke-purple-600',
  },
};
