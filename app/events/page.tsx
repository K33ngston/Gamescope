"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateEventDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          Create Event
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create your gaming event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Event Title</label>
            <Input placeholder="Summer Game Fest 2025" />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe your event..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input type="date" />
            </div>

            <div>
              <label className="text-sm font-medium">Time</label>
              <Input type="time" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <Input placeholder="Los Angeles Convention Center" />
          </div>

          <div>
            <label className="text-sm font-medium">Event Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Tournament">Tournament</SelectItem>
                <SelectItem value="Meetup">Meetup</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Launch">Launch Event</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Specify Event Type</label>
            <Input placeholder="Enter custom event type" />
          </div>

          <div>
            <label className="text-sm font-medium">Duration (Minutes)</label>
            <Input type="number" min="1" placeholder="e.g., 120" />
          </div>

          <div>
            <label className="text-sm font-medium">
              Maximum Attendees (Optional)
            </label>
            <Input
              type="number"
              min="1"
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Create Event
            </Button>

            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Events = () => {
  const sampleEvents = [
    {
      id: "1",
      title: "Nairobi Gaming Expo",
      description:
        "A massive gathering of gamers, developers, and esports competitors.",
      event_date: "March 22, 2025",
      event_time: "2:00 PM",
      location: "KICC, Nairobi",
      type: "Expo",
      duration: "4hr",
      attendees: "500 max",
    },
    {
      id: "2",
      title: "Online Esports Championship",
      description:
        "Compete against top players across Africa in this action-packed esports tournament.",
      event_date: "April 10, 2025",
      event_time: "6:00 PM",
      location: "Online",
      type: "Tournament",
      duration: "3hr 30min",
      attendees: "Unlimited",
    },
    {
      id: "3",
      title: "Indie Game Developer Meet",
      description:
        "Meet indie developers, showcase new projects, and network with the gaming community.",
      event_date: "May 6, 2025",
      event_time: "1:00 PM",
      location: "Sarit Centre, Nairobi",
      type: "Meetup",
      duration: "2hr",
      attendees: "80 max",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                  Gaming Events
                </h1>
                <p className="text-muted-foreground">
                  Discover and join gaming events around the world
                </p>
              </div>

              <CreateEventDialog />
            </div>

            <div className="grid gap-6">
              {sampleEvents.map((event) => (
                <Card
                  key={event.id}
                  className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all hover:shadow-glow"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border">
                        <Calendar className="h-16 w-16 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            {event.title}
                          </h2>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            {event.type}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{event.event_date}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-secondary" />
                          <span>{event.event_time}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-accent" />
                          <span>{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-secondary" />
                          <span>Duration: {event.duration}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{event.attendees}</span>
                        </div>
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
};

export default Events;
