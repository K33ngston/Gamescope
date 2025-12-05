"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  username: string;
  gameName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

const EggAnimation = ({ type, onComplete }: { type: "fresh" | "rotten"; onComplete: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsAnimating(false);
      onComplete();
    }, 2000);

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500",
        isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )}
    >
      <div className="relative animate-bounce">
        <div className="text-8xl drop-shadow-2xl animate-pulse">
          {type === "fresh" ? "🥚" : "🤢"}
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <p
            className={cn(
              "text-xl font-bold px-4 py-2 rounded-full animate-fade-in",
              type === "fresh"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            )}
          >
            {type === "fresh" ? "Fresh Egg! 🎉" : "Rotten Egg! 💀"}
          </p>
        </div>
      </div>
    </div>
  );
};

const EggRatingDisplay = ({
  rottenPercentage,
  freshCount,
  rottenCount,
}: {
  rottenPercentage: number;
  freshCount: number;
  rottenCount: number;
}) => (
  <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl mb-1">🥚</div>
          <div className="text-2xl font-bold text-green-400">{freshCount}</div>
          <div className="text-xs text-muted-foreground">Fresh</div>
        </div>

        <div className="h-12 w-px bg-border" />

        <div className="text-center">
          <div className="text-3xl mb-1">🤢</div>
          <div className="text-2xl font-bold text-red-400">{rottenCount}</div>
          <div className="text-xs text-muted-foreground">Rotten</div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm text-muted-foreground mb-1">Rotten Egg Rate</div>
        <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          {rottenPercentage}%
        </div>
      </div>
    </div>

    <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
        style={{ width: `${rottenPercentage}%` }}
      />
    </div>
  </div>
);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [gameName, setGameName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  const [eggType, setEggType] = useState<"fresh" | "rotten">("fresh");

  async function fetchReviews() {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const freshCount = reviews.filter((r) => r.rating >= 4).length;
  const rottenCount = reviews.filter((r) => r.rating <= 2).length;
  const total = freshCount + rottenCount;
  const rottenPercentage = total > 0 ? Math.round((rottenCount / total) * 100) : 0;

  async function submitReview() {
    if (!reviewText.trim() || !gameName.trim() || rating === 0) {
      toast.error("Please fill all fields and choose a rating.");
      return;
    }

    const res = await fetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ gameName, reviewText, rating }),
    });

    if (!res.ok) {
      toast.error("Failed to post review");
      return;
    }

    toast.success("Review posted!");
    setReviewText("");
    setGameName("");
    setRating(0);

    setEggType(rating >= 4 ? "fresh" : "rotten");
    setShowEgg(true);

    fetchReviews();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
              Reviews
            </h1>
            <p className="text-muted-foreground mb-8">
              Share your gaming experiences and read what others think.
            </p>

            <EggRatingDisplay
              rottenPercentage={rottenPercentage}
              freshCount={freshCount}
              rottenCount={rottenCount}
            />

            <Card className="p-6 mb-8 bg-card/50 backdrop-blur border-border">
              <h2 className="text-xl font-semibold mb-4">Write a Review</h2>

              <div className="space-y-4">
                <Input
                  placeholder="Game name..."
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                />

                <Textarea
                  placeholder="Share your thoughts about the game..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-32"
                />

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Button
                        key={s}
                        variant="ghost"
                        size="icon"
                        onMouseEnter={() => setHoverStar(s)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() => setRating(s)}
                      >
                        <Star
                          className={cn(
                            "h-5 w-5 transition-all",
                            s <= (hoverStar || rating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      </Button>
                    ))}
                  </div>

                  <Button onClick={submitReview} className="bg-gradient-to-r from-primary to-accent">
                    Post Review
                  </Button>
                </div>
              </div>
            </Card>

            {showEgg && (
              <EggAnimation type={eggType} onComplete={() => setShowEgg(false)} />
            )}

            <div className="space-y-6">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.username ?? "unknown"}`}
                      />
                      <AvatarFallback>{review.username?.[0] ?? "?"}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{review.username ?? "Unknown User"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>

                      <p className="text-primary/80 font-medium mb-2">{review.gameName}</p>
                      <p className="text-foreground/90 mb-4">{review.reviewText}</p>

                      <div className="flex gap-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ThumbsUp className="h-4 w-4" /> {0}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" /> {0}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
