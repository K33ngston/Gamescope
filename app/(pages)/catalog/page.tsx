"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GameReview {
  id: number;
  title: string;
  genre: string;
  platform: string;
  rating: number;
  description: string;
  releaseDate: string;
}

const RottenEgg = ({ rating, className }: { rating: number; className?: string }) => {
  const isFresh = rating >= 60;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className={cn(
          "transition-all duration-500",
          isFresh ? "animate-scale-in" : "animate-crack-egg"
        )}
      >
        <ellipse
          cx="24"
          cy="26"
          rx="14"
          ry="18"
          className={cn(
            "transition-all duration-500",
            isFresh
              ? "fill-amber-100 stroke-amber-400"
              : "fill-emerald-900 stroke-emerald-950"
          )}
          strokeWidth="2"
        />

        {!isFresh && (
          <g className="animate-fade-in">
            <path
              d="M 18 20 L 22 16 L 20 12"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-emerald-950"
            />
            <path
              d="M 30 22 L 26 18 L 28 14"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-emerald-950"
            />
            <path
              d="M 16 30 L 20 26 L 18 34"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-emerald-950"
            />
            <path
              d="M 32 28 L 28 32 L 30 36"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-emerald-950"
            />
          </g>
        )}

        {isFresh && (
          <ellipse
            cx="20"
            cy="22"
            rx="4"
            ry="6"
            className="fill-white opacity-60 animate-fade-in"
          />
        )}

        {!isFresh && (
          <g className="animate-fade-in">
            <circle cx="22" cy="24" r="3" className="fill-emerald-950 opacity-70" />
            <circle cx="28" cy="28" r="2" className="fill-emerald-950 opacity-70" />
            <circle cx="20" cy="32" r="2.5" className="fill-emerald-950 opacity-70" />
          </g>
        )}
      </svg>
    </div>
  );
};

const gameReviews: GameReview[] = [
  {
    id: 1,
    title: "Cyber Warriors 2077",
    genre: "Action RPG",
    platform: "PC, PS5, Xbox",
    rating: 92,
    description:
      "A masterpiece of storytelling and gameplay mechanics. The open world is breathtaking and the combat system is incredibly satisfying.",
    releaseDate: "2024-03-15",
  },
  {
    id: 2,
    title: "Fantasy Quest Online",
    genre: "MMORPG",
    platform: "PC",
    rating: 78,
    description:
      "Solid MMO experience with engaging raids and a vibrant community. Some balance issues but overall enjoyable.",
    releaseDate: "2024-02-20",
  },
  {
    id: 3,
    title: "Space Invaders Reborn",
    genre: "Arcade",
    platform: "Mobile, Switch",
    rating: 45,
    description:
      "Disappointing remake that fails to capture the magic of the original. Microtransactions ruin the experience.",
    releaseDate: "2024-01-10",
  },
  {
    id: 4,
    title: "Racing Legends Ultimate",
    genre: "Racing",
    platform: "PS5, Xbox, PC",
    rating: 88,
    description:
      "Best racing game of the year. Stunning graphics and physics that feel incredibly realistic.",
    releaseDate: "2024-04-05",
  },
  {
    id: 5,
    title: "Horror Mansion VR",
    genre: "Horror",
    platform: "VR",
    rating: 35,
    description:
      "Jump scares are cheap and the VR implementation causes motion sickness. Not recommended.",
    releaseDate: "2024-03-28",
  },
  {
    id: 6,
    title: "Strategy Empire Builder",
    genre: "Strategy",
    platform: "PC",
    rating: 85,
    description:
      "Deep strategy game with endless replayability. The learning curve is steep but rewarding.",
    releaseDate: "2024-02-14",
  },
  {
    id: 7,
    title: "Battle Royale Elite",
    genre: "Battle Royale",
    platform: "All Platforms",
    rating: 72,
    description:
      "Solid BR game but doesn't bring anything new to the genre. Good for casual players.",
    releaseDate: "2024-01-20",
  },
  {
    id: 8,
    title: "Puzzle Paradise Pro",
    genre: "Puzzle",
    platform: "Mobile",
    rating: 55,
    description:
      "Too many ads interrupt gameplay. Puzzles are repetitive after the first few levels.",
    releaseDate: "2024-03-01",
  },
  {
    id: 9,
    title: "Adventure Seekers 3",
    genre: "Adventure",
    platform: "PS5, Xbox",
    rating: 94,
    description:
      "Absolutely incredible. The best entry in the series with stunning visuals and an emotional story.",
    releaseDate: "2024-04-20",
  },
  {
    id: 10,
    title: "Sports Championship 2024",
    genre: "Sports",
    platform: "All Platforms",
    rating: 68,
    description:
      "Decent sports sim with improved graphics but gameplay feels unchanged from last year.",
    releaseDate: "2024-03-10",
  },
  {
    id: 11,
    title: "Zombie Apocalypse Survival",
    genre: "Survival Horror",
    platform: "PC, PS5",
    rating: 81,
    description:
      "Tense survival experience with great atmosphere. Co-op mode is fantastic.",
    releaseDate: "2024-02-28",
  },
  {
    id: 12,
    title: "Fighting Champions Arena",
    genre: "Fighting",
    platform: "All Platforms",
    rating: 42,
    description:
      "Poor netcode makes online play frustrating. Character balance is completely off.",
    releaseDate: "2024-01-15",
  },
];

const Catalog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Game Catalog</h1>
              <p className="text-muted-foreground">
                Reviews from all genres - Rated by Rotten Eggs percentage
              </p>
            </div>

            <div className="grid gap-6">
              {gameReviews.map((game) => (
                <Card
                  key={game.id}
                  className="overflow-hidden hover:shadow-elevated transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{game.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{game.genre}</Badge>
                          <Badge variant="outline">{game.platform}</Badge>
                          <Badge variant="outline">{game.releaseDate}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RottenEgg rating={game.rating} />
                        <div className="text-center">
                          <div
                            className={cn(
                              "text-lg font-bold",
                              game.rating >= 60
                                ? "text-amber-500"
                                : "text-emerald-600"
                            )}
                          >
                            {game.rating}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {game.rating >= 60 ? "Fresh Egg" : "Rotten Egg"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground">{game.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Catalog;
