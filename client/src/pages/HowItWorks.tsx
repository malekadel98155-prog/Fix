import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Search, BrainCircuit, CheckCircle } from "lucide-react";
import aiImage from "@assets/generated_images/ai_scanning_smartphone_visualization.png";

export default function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: t("howitworks.step1.title"),
      desc: t("howitworks.step1.desc"),
      color: "bg-blue-500"
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: t("howitworks.step2.title"),
      desc: t("howitworks.step2.desc"),
      color: "bg-purple-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: t("howitworks.step3.title"),
      desc: t("howitworks.step3.desc"),
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">{t("howitworks.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("howitworks.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center bg-card p-8 rounded-2xl border border-border shadow-sm z-10"
            >
              <div className={`w-16 h-16 rounded-full ${step.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-muted/30 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img 
            src={aiImage}
            alt="AI Technology" 
            className="w-full md:w-1/2 rounded-2xl shadow-xl"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4">{t("howitworks.ai.title")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("howitworks.ai.desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
