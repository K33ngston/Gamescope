import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Eye } from "lucide-react";
import { GameCard } from "@/components/GameCard";

const Trending = () => {
  const trendingGames = [
    {
      id: 1,
      title: "Elden Ring",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
      rating: 9.6,
      genre: "RPG",
      platform: "Multi",
      trend: "+45%",
    },
    {
      id: 2,
      title: "Baldur's Gate 3",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=225&fit=crop",
      rating: 9.4,
      genre: "RPG",
      platform: "PC",
      trend: "+38%",
    },
    {
      id: 3,
      title: "Spider-Man 2",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=225&fit=crop",
      rating: 9.2,
      genre: "Action",
      platform: "PS5",
      trend: "+32%",
    },
  ];

  const remasteredGames = [
    {
      id: 1,
      title: "Need for Speed Hot Pursuit Remastered",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=225&fit=crop",
      rating: 8.5,
      genre: "Racing",
      platform: "Multi",
    },
    {
      id: 2,
      title: "Assassin's Creed 2 Remastered",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
      rating: 9.0,
      genre: "Action",
      platform: "Multi",
    },
    {
      id: 3,
      title: "Mass Effect Legendary Edition",
      image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=225&fit=crop",
      rating: 9.3,
      genre: "RPG",
      platform: "Multi",
    },
    {
      id: 4,
      title: "The Last of Us Part I",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop",
      rating: 8.8,
      genre: "Action",
      platform: "PS5",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
              Trending Now
            </h1>

            <p className="text-muted-foreground mb-8">
              Discover what&apost;s hot in the gaming world
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">Most Popular</h3>
                </div>
                <p className="text-3xl font-bold">2.4M</p>
                <p className="text-sm text-muted-foreground">
                  Active players now
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                  <h3 className="text-lg font-semibold">Rising Fast</h3>
                </div>
                <p className="text-3xl font-bold">+187%</p>
                <p className="text-sm text-muted-foreground">
                  Growth this week
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-6 w-6 text-accent" />
                  <h3 className="text-lg font-semibold">Most Viewed</h3>
                </div>
                <p className="text-3xl font-bold">8.9M</p>
                <p className="text-sm text-muted-foreground">Views today</p>
              </Card>
            </div>

            {/* Trending Games */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Trending Games</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingGames.map((game) => (
                  <div key={game.id} className="relative">
                    <Badge className="absolute top-2 right-2 z-10 bg-primary/90 text-white border-0">
                      {game.trend}
                    </Badge>
                    <GameCard {...game} />
                  </div>
                ))}
              </div>
            </div>

            {/* Remastered Classics */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Remastered Classics</h2>
              <p className="text-muted-foreground mb-6">
                Old favorites, reimagined for modern platforms
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {remasteredGames.map((game) => (
                  <GameCard key={game.id} {...game} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Trending;
