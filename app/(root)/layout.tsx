"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/contexts/AuthContext";

import Link from "next/link";
import { Gamepad2, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
              GameScope
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-5xl w-full text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
            Welcome to GameScope
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-16 animate-fade-in">
            Your ultimate gaming companion. Choose your destination:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/dashboard" className="group">
              <Card className="p-10 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 hover:border-primary hover:shadow-glow transition-all cursor-pointer h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Home className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Dashboard
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Access your personalized gaming dashboard with stats, library, and activity.
                  </p>
                  <Button className="bg-gradient-primary hover:opacity-90 w-full">
                    Go to Dashboard
                  </Button>
                </div>
              </Card>
            </Link>

            <Link href="/community" className="group">
              <Card className="p-10 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30 hover:border-secondary hover:shadow-glow transition-all cursor-pointer h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-10 w-10 text-secondary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-secondary transition-colors">
                    Community
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Connect with fellow gamers, share experiences, and join discussions.
                  </p>
                  <Button className="bg-gradient-secondary hover:opacity-90 w-full">
                    Go to Community
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>© 2025 GameScope. Built for gamers, by gamers.</p>
        </div>
      </footer>
    </div>
  );
}
