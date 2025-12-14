import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import logo from "@assets/1765471223364_1765584254415.jpg";
import { Globe, Menu, X, Bot } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const { language, setLanguage, t } = useI18n();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/chat", label: "AI Fixer" },
    { href: "/services", label: t("nav.services") },
    { href: "/how-it-works", label: t("nav.howitworks") },
    { href: "/testimonials", label: t("nav.testimonials") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2">
            <img src={logo} alt="FixIt Logo" className="h-10 w-10 object-contain rounded-full" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {t("app.name")}
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {link.label}
              </a>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "العربية" : "English"}
          </Button>
          
          <Link href="/chat">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2">
              <Bot className="w-4 h-4" />
              {t("search.button")}
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
           <ThemeToggle />
           
           <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Globe className="h-5 w-5" />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a 
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                <Link href="/chat">
                  <Button className="w-full mt-4 gap-2" onClick={() => setIsOpen(false)}>
                     <Bot className="w-4 h-4" />
                    {t("search.button")}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
