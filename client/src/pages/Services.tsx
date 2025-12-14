import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Smartphone, Monitor, Wifi, Cpu, Wrench, HardDrive, Shield, Server } from "lucide-react";
import { motion } from "framer-motion";
import servicesHeader from "@assets/generated_images/modern_tech_repair_workspace.png";

export default function Services() {
  const { t } = useI18n();

  const services = [
    { icon: <Smartphone />, label: t("cat.phone"), desc: t("services.desc.phone") },
    { icon: <Monitor />, label: t("cat.pc"), desc: t("services.desc.pc") },
    { icon: <Wifi />, label: t("cat.internet"), desc: t("services.desc.internet") },
    { icon: <Cpu />, label: t("cat.smart"), desc: t("services.desc.smart") },
    { icon: <Wrench />, label: t("cat.general"), desc: t("services.desc.general") },
    { icon: <HardDrive />, label: t("cat.data"), desc: t("services.desc.data") },
    { icon: <Shield />, label: t("cat.security"), desc: t("services.desc.security") },
    { icon: <Server />, label: t("cat.server"), desc: t("services.desc.server") }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Services Header Image */}
      <div className="w-full h-[300px] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
             <h1 className="text-4xl md:text-5xl font-bold text-white">{t("services.title")}</h1>
        </div>
        <img src={servicesHeader} alt="Services" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{service.label}</h3>
              <p className="text-sm text-muted-foreground">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
