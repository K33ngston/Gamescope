import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface GameCardProps {
  title: string;
  image: string;
  rating: number;
  genre: string;
  platform: string;
}

export const GameCard = ({ title, image, rating, genre, platform }: GameCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-elevated transition-all duration-300 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image} 
          width={300}
          height={300}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {platform}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h4 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{genre}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-semibold">{rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
