import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">{t("contact.title")}</h1>
          <p className="text-muted-foreground">{t("contact.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold">{t("contact.touch")}</h2>
            <div className="space-y-6">
              <Card className="p-6 flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t("contact.email")}</h3>
                  <p className="text-muted-foreground">support@fixit.app</p>
                </div>
              </Card>

              <Card className="p-6 flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t("contact.phone")}</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </Card>

              <Card className="p-6 flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t("contact.office")}</h3>
                  <p className="text-muted-foreground">123 Tech Street, Silicon Valley, CA</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">{t("contact.form.title")}</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.form.fname")}</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.form.lname")}</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("contact.form.email")}</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("contact.form.message")}</label>
                  <Textarea placeholder={t("search.placeholder")} className="min-h-[150px]" />
                </div>
                <Button className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  {t("contact.form.submit")}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
