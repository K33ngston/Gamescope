import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

import { Library, Star, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GameCard } from "@/components/GameCard";
import { StatCard } from "@/components/StatCard";
import { UpcomingEvents } from "@/components/UpcomingEvents";

const recentGames = [
  {
    title: "Baldur's Gate 3",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
    rating: 9.4,
    genre: "RPG",
    platform: "PC",
  },
  {
    title: "Cyberpunk 2077",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    rating: 8.7,
    genre: "Action RPG",
    platform: "PS5",
  },
  {
    title: "Elden Ring",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    rating: 9.2,
    genre: "Action",
    platform: "Xbox",
  },
  {
    title: "Hogwarts Legacy",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
    rating: 8.5,
    genre: "Adventure",
    platform: "PC",
  },
];

const wishlistGames = [
  {
    title: "Starfield",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80",
    rating: 8.9,
    genre: "RPG",
    platform: "Xbox",
  },
  {
    title: "Spider-Man 2",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
    rating: 9.1,
    genre: "Action",
    platform: "PS5",
  },
  {
    title: "Final Fantasy XVI",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
    rating: 8.8,
    genre: "RPG",
    platform: "PS5",
  },
  {
    title: "Alan Wake II",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80",
    rating: 9.0,
    genre: "Horror",
    platform: "PC",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt="Gamer" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  GM
                </AvatarFallback>
              </Avatar>
              <h2 className="text-3xl font-display font-bold">
                Welcome back,{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Gamer
                </span>
              </h2>
            </div>
            <p className="text-muted-foreground">
              Here&apost;s what&apost;s happening with your gaming journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Games in Library"
              value="127"
              change="+5 this week"
              icon={Library}
              trend="up"
            />
            <StatCard
              title="Reviews Written"
              value="43"
              change="+2 this month"
              icon={Star}
              trend="up"
            />
            <StatCard
              title="Hours Played"
              value="284"
              change="+12 this week"
              icon={Clock}
              trend="up"
            />
            <StatCard
              title="Reputation Score"
              value="8.9"
              change="+0.3 this month"
              icon={TrendingUp}
              trend="up"
            />
          </div>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recently Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentGames.map((game, index) => (
                    <GameCard key={index} {...game} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Your Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistGames.map((game, index) => (
                      <GameCard key={index} {...game} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <UpcomingEvents />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
