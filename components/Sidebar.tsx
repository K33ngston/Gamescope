import Link from "next/link";
import { Home, Library, Star, Calendar, TrendingUp, Users, BookOpen, Trophy, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Library, label: "My Library", path: "/library" },
  { icon: Star, label: "Reviews", path: "/reviews" },
  { icon: BookOpen, label: "Catalog", path: "/catalog" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: TrendingUp, label: "Trending", path: "/trending" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: Trophy, label: "Gamification", path: "/gamification" },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card h-[calc(100vh-4rem)]">
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 text-left"
            asChild
          >
            <Link href={item.path}>
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          asChild
        >
          <Link href="/auth">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </Button>
      </div>
    </aside>
  );
};
