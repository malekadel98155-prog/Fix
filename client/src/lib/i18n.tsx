import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.name": "FixIt",
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.howitworks": "How It Works",
    "nav.testimonials": "Testimonials",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "hero.card.describe": "Describe Your Issue",
    "hero.card.match": "Get Matched with AI",
    "hero.card.solved": "Problem Solved",
    "hero.title": "Solve Your Problems. Fast & Easy",
    "hero.subtitle": "Get instant, step-by-step solutions for your phone, computer, and internet issues.",
    "search.placeholder": "Describe your problem (e.g., 'iPhone won't charge')...",
    "search.button": "Fix It Now",
    "categories.title": "Common Issues",
    "cat.phone": "Phone & Tablet",
    "cat.pc": "Computer & Laptop",
    "cat.internet": "Internet & Network",
    "cat.smart": "Smart Devices",
    "cat.general": "General Repair",
    "cat.data": "Data Recovery",
    "cat.security": "Security",
    "cat.server": "Server Support",
    "services.title": "Our Services",
    "services.subtitle": "Comprehensive technical solutions for all your devices. We cover everything from simple software glitches to complex hardware repairs.",
    "services.desc.phone": "Screen repair, battery replacement, software issues",
    "services.desc.pc": "Hardware upgrades, virus removal, OS installation",
    "services.desc.internet": "Network setup, speed optimization, connectivity issues",
    "services.desc.smart": "Smart home setup, device pairing, troubleshooting",
    "services.desc.general": "Diagnostics and fixing of miscellaneous electronics",
    "services.desc.data": "Recovering lost data from damaged drives",
    "services.desc.security": "Cybersecurity audits and protection setup",
    "services.desc.server": "Small business server maintenance and setup",
    "howitworks.title": "How It Works",
    "howitworks.subtitle": "Simple, fast, and effective. Here is our process.",
    "howitworks.step1.title": "1. Describe Your Issue",
    "howitworks.step1.desc": "Type your problem in plain language. Our system understands both English and Arabic.",
    "howitworks.step2.title": "2. AI Analysis",
    "howitworks.step2.desc": "SmartFetch™ scans millions of verified solutions from trusted global sources in seconds.",
    "howitworks.step3.title": "3. Get Fixed",
    "howitworks.step3.desc": "Receive a step-by-step guide with images to solve your problem immediately.",
    "howitworks.ai.title": "Powered by Advanced AI",
    "howitworks.ai.desc": "Our proprietary SmartFetch algorithm doesn't just search keywords; it understands the context of your technical problem to find the exact solution you need, filtering out irrelevant forum posts and outdated advice.",
    "testimonials.subtitle": "See what our community has to say about FixIt.",
    "contact.title": "Contact Us",
    "contact.subtitle": "We are here to help. Reach out to us for any inquiries.",
    "contact.touch": "Get in Touch",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.office": "Office",
    "contact.form.title": "Send Message",
    "contact.form.fname": "First Name",
    "contact.form.lname": "Last Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Message",
    "home.learnmore": "Learn More about AI",
    "home.success_stories": "View All Success Stories",
    "smartfetch.title": "SmartFetch Technology",
    "smartfetch.desc": "Can't find it? Our AI searches trusted global sources to find your fix in under 3 seconds.",
    "reviews.title": "What Users Say",
    "reviews.add": "Share Your Experience",
    "reviews.name": "Your Name",
    "reviews.job": "Job Title",
    "reviews.comment": "Your Review",
    "reviews.submit": "Submit Review",
    "faq.title": "Frequently Asked Questions",
    "footer.rights": "© 2024 FixIt. All rights reserved.",
    "loading": "Analyzing problem...",
    "found": "Solution Found!",
    "searching_web": "Searching trusted sources...",
    "analyzing": "Analyzing best solution...",
    "smart_fetch_active": "SmartFetch Active",
  },
  ar: {
    "app.name": "FixIt",
    "nav.home": "الرئيسية",
    "nav.services": "خدماتنا",
    "nav.howitworks": "كيف يعمل",
    "nav.testimonials": "آراء العملاء",
    "nav.faq": "الأسئلة الشائعة",
    "nav.contact": "اتصل بنا",
    "hero.card.describe": "صف مشكلتك",
    "hero.card.match": "تحليل الذكاء الاصطناعي",
    "hero.card.solved": "تم حل المشكلة",
    "hero.title": "حل مشاكلك. بسرعة وسهولة",
    "hero.subtitle": "احصل على حلول فورية خطوة بخطوة لمشاكل هاتفك، حاسوبك، والإنترنت.",
    "search.placeholder": "وصف المشكلة (مثلاً: 'الآيفون لا يشحن')...",
    "search.button": "إصلاح الآن",
    "categories.title": "مشاكل شائعة",
    "cat.phone": "هواتف وأجهزة لوحية",
    "cat.pc": "كمبيوتر ولابتوب",
    "cat.internet": "إنترنت وشبكات",
    "cat.smart": "أجهزة ذكية",
    "cat.general": "إصلاح عام",
    "cat.data": "استعادة البيانات",
    "cat.security": "الأمان والحماية",
    "cat.server": "دعم الخوادم",
    "services.title": "خدماتنا",
    "services.subtitle": "حلول تقنية شاملة لجميع أجهزتك. نغطي كل شيء من المشاكل البرمجية البسيطة إلى إصلاحات الأجهزة المعقدة.",
    "services.desc.phone": "إصلاح الشاشات، استبدال البطاريات، مشاكل البرمجيات",
    "services.desc.pc": "ترقية الأجهزة، إزالة الفيروسات، تثبيت الأنظمة",
    "services.desc.internet": "إعداد الشبكات، تحسين السرعة، مشاكل الاتصال",
    "services.desc.smart": "إعداد المنزل الذكي، اقتران الأجهزة، استكشاف الأخطاء",
    "services.desc.general": "تشخيص وإصلاح الإلكترونيات المتنوعة",
    "services.desc.data": "استعادة البيانات المفقودة من الأقراص التالفة",
    "services.desc.security": "تدقيق الأمن السيبراني وإعداد الحماية",
    "services.desc.server": "صيانة وإعداد خوادم الشركات الصغيرة",
    "howitworks.title": "كيف يعمل",
    "howitworks.subtitle": "بسيط، سريع، وفعال. إليك كيف تتم العملية.",
    "howitworks.step1.title": "1. صف مشكلتك",
    "howitworks.step1.desc": "اكتب مشكلتك بلغة بسيطة. نظامنا يفهم اللغتين الإنجليزية والعربية.",
    "howitworks.step2.title": "2. تحليل الذكاء الاصطناعي",
    "howitworks.step2.desc": "يقوم SmartFetch™ بفحص ملايين الحلول الموثوقة من مصادر عالمية في ثوانٍ.",
    "howitworks.step3.title": "3. احصل على الحل",
    "howitworks.step3.desc": "احصل على دليل خطوة بخطوة مع الصور لحل مشكلتك فوراً.",
    "howitworks.ai.title": "مدعوم بالذكاء الاصطناعي المتقدم",
    "howitworks.ai.desc": "لا تبحث خوارزمية SmartFetch الخاصة بنا عن الكلمات الرئيسية فحسب؛ بل تفهم سياق مشكلتك التقنية للعثور على الحل الدقيق الذي تحتاجه، مع تصفية المشاركات غير ذات الصلة والنصائح القديمة.",
    "testimonials.subtitle": "انظر ماذا يقول مجتمعنا عن FixIt.",
    "contact.title": "اتصل بنا",
    "contact.subtitle": "نحن هنا للمساعدة. تواصل معنا لأي استفسارات.",
    "contact.touch": "تواصل معنا",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "الهاتف",
    "contact.office": "المكتب",
    "contact.form.title": "أرسل رسالة",
    "contact.form.fname": "الاسم الأول",
    "contact.form.lname": "الاسم الأخير",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.message": "الرسالة",
    "contact.form.submit": "إرسال الرسالة",
    "home.learnmore": "اعرف المزيد عن الذكاء الاصطناعي",
    "home.success_stories": "عرض كل قصص النجاح",
    "smartfetch.title": "تقنية SmartFetch",
    "smartfetch.desc": "لم تجد الحل؟ نظامنا الذكي يبحث في المصادر الموثوقة عالمياً ليجد لك الحل في أقل من 3 ثوانٍ.",
    "reviews.title": "آراء المستخدمين",
    "reviews.add": "شاركنا تجربتك",
    "reviews.name": "الاسم",
    "reviews.job": "المسمى الوظيفي",
    "reviews.comment": "رأيك",
    "reviews.submit": "إرسال التقييم",
    "faq.title": "الأسئلة الشائعة",
    "footer.rights": "© 2024 FixIt. جميع الحقوق محفوظة.",
    "loading": "جاري تحليل المشكلة...",
    "found": "تم العثور على الحل!",
    "searching_web": "جاري البحث في المصادر الموثوقة...",
    "analyzing": "جاري تحليل أفضل حل...",
    "smart_fetch_active": "SmartFetch مفعل",
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (language === "ar") {
      document.body.classList.add("font-cairo");
      document.body.classList.remove("font-inter");
    } else {
      document.body.classList.add("font-inter");
      document.body.classList.remove("font-cairo");
    }
  }, [language, dir]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within a I18nProvider");
  }
  return context;
}
