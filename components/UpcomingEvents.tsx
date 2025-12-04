import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    title: "Nairobi Gaming Convention 2025",
    date: "March 15-17, 2025",
    location: "KICC, Nairobi",
    attendees: 1250,
    type: "Convention",
  },
  {
    id: 2,
    title: "East Africa Esports Tournament",
    date: "April 5, 2025",
    location: "Online",
    attendees: 540,
    type: "Esports",
  },
  {
    id: 3,
    title: "Indie Game Showcase Kenya",
    date: "May 20, 2025",
    location: "Sarit Centre, Nairobi",
    attendees: 320,
    type: "Showcase",
  },
];

export const UpcomingEvents = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {event.type}
                </Badge>
              </div>

              <Button size="sm" className="w-full" variant="outline">
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
