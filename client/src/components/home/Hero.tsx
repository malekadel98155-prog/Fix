import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, Cpu, Settings, Handshake, Smartphone, Monitor, Wifi, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { sendMessageToAI } from "@/lib/api";
import heroImage from "@assets/generated_images/tech_support_team_in_modern_office.png";

interface SmartFetchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

function isArabic(text: string) {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

export function SmartFetchOverlay({ isOpen, onClose, query }: SmartFetchOverlayProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<"searching" | "analyzing" | "found" | "error">("searching");
  const [solution, setSolution] = useState("");
  const queryIsArabic = isArabic(query);
  
  useEffect(() => {
    if (isOpen && query.trim()) {
      setStep("searching");
      setSolution("");
      
      const fetchSolution = async () => {
        try {
          setStep("analyzing");
          const response = await sendMessageToAI([
            { role: "user", content: query }
          ]);
          setSolution(response);
          setStep("found");
        } catch (error) {
          console.error("Failed to get AI solution:", error);
          setStep("error");
        }
      };
      
      // Start fetching after a brief delay for UX
      const timer = setTimeout(fetchSolution, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, query]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card className="w-full max-w-2xl bg-card border-primary/20 shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 left-0 w-full h-1 bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: step === "found" ? "100%" : step === "error" ? "100%" : "60%" }}
            transition={{ duration: step === "found" || step === "error" ? 0.3 : 10, ease: "linear" }}
          />
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[350px] md:min-h-[400px] text-center space-y-6">
          <AnimatePresence mode="wait">
            {step === "searching" && (
              <motion.div
                key="searching"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-background p-4 rounded-full border border-primary/20">
                    <GlobeIcon className="w-10 h-10 md:w-12 md:h-12 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t("searching_web")}</h3>
                <p className="text-muted-foreground max-w-md text-sm md:text-base">
                  {queryIsArabic 
                    ? `جاري البحث عن حل لـ "${query}"...`
                    : `Searching for solution to "${query}"...`
                  }
                </p>
              </motion.div>
            )}

            {step === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-background p-4 rounded-full border border-purple-500/20">
                    <Cpu className="w-10 h-10 md:w-12 md:h-12 text-purple-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t("analyzing")}</h3>
                <p className="text-muted-foreground max-w-md text-sm md:text-base">
                   {queryIsArabic 
                    ? "Fix It AI يقوم بتحليل مشكلتك وإيجاد الحل..."
                    : "Fix It AI is analyzing your problem..."
                  }
                </p>
              </motion.div>
            )}

            {step === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center w-full"
              >
                <div className="flex items-center gap-3 mb-6 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20 mx-auto">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-700 dark:text-red-400">
                    {queryIsArabic ? "حدث خطأ" : "Error"}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  {queryIsArabic 
                    ? "فشل الاتصال بـ Fix It AI. يرجى المحاولة مرة أخرى."
                    : "Failed to connect to Fix It AI. Please try again."
                  }
                </p>
                <Button onClick={onClose} variant="outline">
                  {queryIsArabic ? "إغلاق" : "Close"}
                </Button>
              </motion.div>
            )}

            {step === "found" && (
              <motion.div
                key="found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center w-full text-left"
                dir={queryIsArabic ? "rtl" : "ltr"}
              >
                <div className="flex items-center gap-3 mb-6 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 mx-auto">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-700 dark:text-green-400">{t("found")}</span>
                </div>
                
                <div className="w-full bg-muted/50 rounded-xl p-4 md:p-6 border border-border max-h-[300px] overflow-y-auto">
                  <h4 className="text-lg md:text-xl font-bold mb-4">
                    {queryIsArabic ? "الحل من Fix It AI" : "Solution from Fix It AI"}
                  </h4>
                  <div className="text-muted-foreground text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                    {solution}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={onClose} className="bg-primary text-white">
                      {queryIsArabic ? "إغلاق" : "Close"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}

function GlobeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" x2="22" y1="12" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

export function Hero() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
  };

  return (
    <section className="relative w-full">
      {/* Hero Section with Image */}
      <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
        <img 
          src={heroImage} 
          alt="FixIt Team" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 text-white drop-shadow-lg">
              {t("hero.title")}
            </h1>
            <p className="text-white/80 text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              {t("hero.subtitle")}
            </p>
            
            {/* Search Bar */}
            <div className="w-full max-w-xl mx-auto px-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-white rounded-lg shadow-2xl overflow-hidden">
                  <Input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("search.placeholder")}
                    className="border-0 shadow-none focus-visible:ring-0 text-base sm:text-lg h-12 sm:h-14 bg-transparent px-4 text-black placeholder:text-gray-400 flex-1" 
                  />
                  <Button 
                    type="submit"
                    size="icon" 
                    className="h-12 sm:h-14 w-12 sm:w-14 rounded-none bg-blue-500 hover:bg-blue-600 text-white shadow-none shrink-0"
                  >
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto -mt-16 md:-mt-20 relative z-10">
            <FeatureCard 
              icon={<Settings className="w-6 h-6 md:w-8 md:h-8 text-primary" />} 
              label={t("hero.card.describe")} 
            />
            <FeatureCard 
              icon={<Search className="w-6 h-6 md:w-8 md:h-8 text-primary" />} 
              label={t("hero.card.match")} 
            />
            <FeatureCard 
              icon={<Handshake className="w-6 h-6 md:w-8 md:h-8 text-primary" />} 
              label={t("hero.card.solved")} 
            />
          </div>
        </div>
      </div>

      <SmartFetchOverlay 
        isOpen={isSearching} 
        onClose={() => setIsSearching(false)} 
        query={query} 
      />
    </section>
  );
}

function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 md:p-8 rounded-xl shadow-xl flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform duration-300 border border-gray-100"
    >
      <div className="mb-1 md:mb-2">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm md:text-base">{label}</h3>
    </motion.div>
  );
}

export function CategoryCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group h-full">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="font-medium text-xs md:text-sm text-muted-foreground group-hover:text-primary transition-colors text-center">{label}</span>
    </div>
  );
}
