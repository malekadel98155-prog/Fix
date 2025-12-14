import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { ReviewsSection } from "@/components/home/Reviews";
import { motion } from "framer-motion";

export default function Testimonials() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">{t("reviews.title")}</h1>
          <p className="text-muted-foreground">{t("testimonials.subtitle")}</p>
        </motion.div>
        
        <ReviewsSection />
      </div>
    </div>
  );
}
