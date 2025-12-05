"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, Star, ThumbsUp, Flame, Gift, Award } from "lucide-react";
import { toast, Toaster } from "sonner";

interface LeaderboardItem {
  name: string;
  avatar?: string;
  reviews: number;
  upvotes: number;
  points: number;
  badges: string[];
}

interface BadgeInfo {
  emoji: string;
  name: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: any;
}

const badgesList: BadgeInfo[] = [
  { emoji: "🏆", name: "First Review" },
  { emoji: "⭐", name: "Five Star Fan" },
  { emoji: "🔥", name: "Hot Streak" },
  { emoji: "💬", name: "Story Teller" },
  { emoji: "👑", name: "Legend" }
];

export default function Gamification() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  const fetchStats = async () => {
    const res = await fetch("/api/gaming?action=stats");
    const data = await res.json();
    setStats([
      { label: "Total Points", value: String(data.totalPoints), icon: Trophy },
      { label: "Reviews", value: String(data.totalReviews), icon: Star },
      { label: "Upvotes", value: String(data.totalUpvotes), icon: ThumbsUp },
      { label: "Streak", value: data.streakText, icon: Flame }
    ]);
  };

  const fetchLeaderboard = async () => {
    const res = await fetch("/api/gaming?action=leaderboard");
    const data = await res.json();
    setLeaderboard(data);
  };

  useEffect(() => {
    fetchStats();
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Gamification
            </h1>

            <p className="text-muted-foreground">
              Earn points, unlock badges, and climb the leaderboard
            </p>

            <Card className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Daily Bonus</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>Streak active</span>
                  </div>
                </div>
              </div>
              <Button size="sm">Claim +10</Button>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <Card key={i} className="p-4 bg-card/50 backdrop-blur border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted text-primary">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Badges</h2>
                <span className="ml-auto text-sm text-muted-foreground">
                  {3}/{badgesList.length} earned
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {badgesList.map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-3 rounded-lg bg-primary/20 border border-primary/30"
                  >
                    <span className="text-3xl mb-1">{b.emoji}</span>
                    <span className="text-xs text-center font-medium truncate w-full">
                      {b.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <h2 className="text-xl font-bold mb-4">Write a Review</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const gameName = (form.elements.namedItem("gameName") as HTMLInputElement).value;
                    const reviewText = (form.elements.namedItem("reviewText") as HTMLTextAreaElement).value;
                    const rating = Number((form.elements.namedItem("rating") as HTMLSelectElement).value);

                    const res = await fetch("/api/gaming", {
                      method: "POST",
                      body: JSON.stringify({
                        action: "create-review",
                        gameName,
                        reviewText,
                        rating
                      })
                    });

                    const data = await res.json();

                    if (res.ok) {
                      toast.success("Review submitted");
                      form.reset();
                      await fetchStats();
                      await fetchLeaderboard();
                    } else {
                      toast.error(data.message);
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    name="gameName"
                    placeholder="Game name..."
                    className="w-full p-2 rounded bg-input border border-border"
                    required
                  />

                  <select
                    name="rating"
                    className="w-full p-2 rounded bg-input border border-border"
                    required
                  >
                    <option value="5">⭐ 5 Stars</option>
                    <option value="4">⭐ 4 Stars</option>
                    <option value="3">⭐ 3 Stars</option>
                    <option value="2">⭐ 2 Stars</option>
                    <option value="1">⭐ 1 Star</option>
                  </select>

                  <textarea
                    name="reviewText"
                    placeholder="Write your review..."
                    className="w-full p-2 rounded bg-input border border-border min-h-32"
                    required
                  />

                  <Button className="w-full bg-gradient-to-r from-primary to-accent">
                    Submit Review
                  </Button>
                </form>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Leaderboard</h2>
                </div>

                <Tabs defaultValue="weekly">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="all">All-Time</TabsTrigger>
                  </TabsList>

                  <TabsContent value="weekly" className="space-y-3">
                    {leaderboard.map((u, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl w-10 text-center font-bold">{i + 1}</div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={u.avatar} />
                          <AvatarFallback>{u.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold truncate">{u.name}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {u.reviews}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {u.upvotes}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{u.points}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
