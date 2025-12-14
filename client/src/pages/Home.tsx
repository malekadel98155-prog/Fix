import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { ReviewsSection } from "@/components/home/Reviews";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Features/Value Prop - Mini Version */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=2070&auto=format&fit=crop" 
                alt="Tech Repair" 
                className="relative rounded-3xl shadow-2xl border border-border/50"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">{t("smartfetch.title")}</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("smartfetch.desc")}
              </p>
              <div className="pt-4">
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg">{t("home.learnmore")}</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mini Reviews */}
        <div className="py-10 bg-muted/20 text-center">
            <h2 className="text-2xl font-bold mb-6">{t("reviews.title")}</h2>
            <Link href="/testimonials">
              <Button size="lg" variant="secondary">{t("home.success_stories")}</Button>
            </Link>
        </div>
      </main>

      <footer className="py-8 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>{t("footer.rights")}</p>
        </div>
      </footer>
    </div>
  );
}
