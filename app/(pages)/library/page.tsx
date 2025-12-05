import { GameCard } from "@/components/GameCard";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Grid, List } from "lucide-react";

const ownedGames = [
  {
    id: 1,
    title: "The Witcher 3",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=225&fit=crop",
    rating: 9.5,
    genre: "RPG",
    platform: "PC",
    hoursPlayed: 245
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=225&fit=crop",
    rating: 8.7,
    genre: "RPG",
    platform: "PS5",
    hoursPlayed: 87
  },
  {
    id: 3,
    title: "Red Dead Redemption 2",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
    rating: 9.8,
    genre: "Action",
    platform: "Xbox",
    hoursPlayed: 156
  }
];

const Library = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                  My Library
                </h1>
                <p className="text-muted-foreground">
                  {ownedGames.length} games in your collection
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Grid className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search your library..."
                className="pl-10 bg-card border-border"
              />
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="all">All Games</TabsTrigger>
                <TabsTrigger value="recent">Recently Played</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="installed">Installed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedGames.map((game) => (
                    <div key={game.id} className="group">

                         {/* {...game} */}
                      {/* <GameCard title={""} image={""} rating={0} genre={""} platform={""} /> */}
                      <GameCard />
                      <div className="mt-2 text-sm text-muted-foreground">
                        {game.hoursPlayed} hours played
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedGames.slice(0, 2).map((game) => (
                    <div key={game.id} className="group">
                      <GameCard title={""} image={""} rating={0} genre={""} platform={""} />
                                            <GameCard />

                      <div className="mt-2 text-sm text-muted-foreground">
                        Last played: 2 days ago
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Library;
