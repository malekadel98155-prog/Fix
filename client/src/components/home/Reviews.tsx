import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Star, User, Briefcase, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialReviews } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export function ReviewsSection() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ name: "", job: "", comment: "", rating: 5 });
  const [isOpen, setIsOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fixit_reviews");
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const review = {
      id: Date.now(),
      ...newReview,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newReview.name}`
    };
    
    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem("fixit_reviews", JSON.stringify(updatedReviews));
    
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });
    setIsOpen(false);
    setNewReview({ name: "", job: "", comment: "", rating: 5 });
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("reviews.title")}</h2>
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="fill-current w-5 h-5" />
              <Star className="fill-current w-5 h-5" />
              <Star className="fill-current w-5 h-5" />
              <Star className="fill-current w-5 h-5" />
              <Star className="fill-current w-5 h-5" />
              <span className="text-muted-foreground ml-2 text-sm font-medium">(4.9/5 from 2,300+ users)</span>
            </div>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <MessageSquare className="w-4 h-4" />
                {t("reviews.add")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("reviews.add")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("reviews.name")}</label>
                  <Input 
                    required 
                    value={newReview.name}
                    onChange={e => setNewReview({...newReview, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("reviews.job")}</label>
                  <Input 
                    required
                    value={newReview.job}
                    onChange={e => setNewReview({...newReview, job: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("reviews.comment")}</label>
                  <Textarea 
                    required
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full">{t("reviews.submit")}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full bg-muted object-cover" />
                <div>
                  <h4 className="font-bold">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.job}</p>
                </div>
              </div>
              <div className="flex gap-1 text-yellow-500 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "{review.comment}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
