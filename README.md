# My Life Tracker | متتبع إنجاز الحياة الشخصي 📊🌱

> **نظام شخصي هادئ لتتبع الالتزام والإنجاز اليومي بديناميكية تامة وحفظ السجل التاريخي**  
> A clean, responsive daily habit and life tracking dashboard with dynamic analytics, history logging, and full Arabic/English bilingual support.

---

## 🌟 الميزات الرئيسية / Key Features

- 📅 **لوحة تحكم اليوم (Today's Dashboard):** تتبع المهام اليومية مع إحصائيات فورية ومؤشرات إنجاز ذكية واحتفالات تشجيعية عند الإنجاز.
- 📂 **أقسام وتصنيفات مرنة (Custom Sections & Tasks):** تخصيص الأقسام، المهام، الألوان، والأولويات بسهولة تامة.
- 📈 **محرك حسابات متقدم (Calculation Engine):** حساب نسب الالتزام، معدلات الاستمرارية (Streaks)، والأوزان النسبية لكل مهمة بدقة.
- 📜 **سجل تاريخي كامل (History View):** استعراض تاريخ الإنجاز يوماً بيوم مع إمكانية فتح تفاصيل أي يوم سابق ومراجعة ما تم تحقيقه.
- 💡 **تحليلات ورؤى عميقة (Insights & Analytics):** رسوم بيانية ومخططات توضح توزيع الإنجاز ومعدلات النمو عبر الأسابيع والشهور.
- 🌐 **دعم كامل للغتين (العربية / English):** تبديل سلس بين العربية (RTL) والإنجليزية (LTR) مع خطوط محسنة (`Readex Pro` و `Outfit`).
- 🎨 **تصميم حديث وهادئ (Modern Minimalist UI):** تجربة بصرية مريحة بألوان متناسقة تدعم الوضع الليلي والنهاري.
- 💾 **حفظ محلي آمن (Local Persistence):** حفظ كامل البيانات محلياً على المتصفح عبر `LocalStorage` دون الحاجة لخوادم خارجية، مع إمكانية التصدير والاستيراد بسهولة.

---

## 🛠️ التقنيات المستخدمة / Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Bundler / Tooling:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Code Quality:** [Oxlint](https://oxc.rs/)

---

## 🚀 البدء والتشغيل / Getting Started

### 1. تثبيت الاعتماديات / Install Dependencies
```bash
npm install
```

### 2. التشغيل في بيئة التطوير / Run Development Server
```bash
npm run dev
```

### 3. بناء المشروع للإنتاج / Build for Production
```bash
npm run build
```

### 4. معاينة نسخة الإنتاج / Preview Production Build
```bash
npm run preview
```

### 5. الفحص البرمجي / Linting
```bash
npm run lint
```

---

## 📁 هيكلية المشروع / Project Structure

```text
├── public/                 # الأيقونات والصور العامة (favicons, meta images, svgs)
├── Image/                  # صور توضيحية إضافية
├── src/
│   ├── assets/             # ملفات الوسائط والشعارات
│   ├── components/
│   │   ├── common/         # المكونات المشتركة (Header, Modal, ToastContainer...)
│   │   ├── dashboard/      # مكونات لوحة اليوم (TodayDashboard, SectionCard, TaskItem...)
│   │   ├── history/        # مكونات السجل التاريخي (HistoryView, DayDetailModal...)
│   │   ├── insights/       # مكونات التحليلات والإحصائيات (InsightsView...)
│   │   └── settings/       # مكونات الإعدادات والتحكم (SettingsView, SectionEditor...)
│   ├── constants/          # البيانات الافتراضية الأولية (defaultData.js)
│   ├── context/            # سياق التطبيق وإدارة الحالة (AppContext, useApp)
│   ├── locales/            # ملفات الترجمة (العربية ar.js، والإنجليزية en.js)
│   ├── services/           # محرك الحسابات (calculationEngine) وخدمة التخزين (storageService)
│   ├── App.jsx             # المكون الجذري للتطبيق
│   ├── index.css           # أنماط Tailwind والتنسيقات الشاملة
│   └── main.jsx            # نقطة انطلاق التطبيق (Entry point)
├── index.html              # ملف الـ HTML الأساسي مع وسوم OpenGraph
├── package.json            # إعدادات الحزم والمكتبات
├── vercel.json             # إعدادات النشر على منصة Vercel
└── vite.config.js          # إعدادات Vite ومكونات Tailwind و React
```

---

## 📄 الترخيص / License

هذا المشروع متاح للاستخدام الشخصي والتطوير المستمر.
