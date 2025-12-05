"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

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

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  location: string;
  eventType: string;
  customType: string | null;
  durationMinutes: number | null;
  maxAttendees: number | null;
}

export default function Events() {
  const [eventsList, setEventsList] = useState<EventRow[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [customType, setCustomType] = useState("");
  const [duration, setDuration] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) {
        toast.error("Failed to load events");
        return;
      }
      const data = await res.json();
      setEventsList(data);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDateValue("");
    setTimeValue("");
    setLocation("");
    setType("");
    setCustomType("");
    setDuration("");
    setMaxAttendees("");
  };

  const createEvent = async () => {
    if (!title || !dateValue || !location || !type) {
      toast.error("Please fill in title, date, location and type");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          eventDate: dateValue,
          eventTime: timeValue,
          location,
          eventType: type,
          customType,
          durationMinutes: duration ? Number(duration) : null,
          maxAttendees: maxAttendees ? Number(maxAttendees) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create event");
        return;
      }

      toast.success("Event created");
      resetForm();
      await loadEvents();
    } catch {
      toast.error("Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (value: string) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  const effectiveType = (e: EventRow) => {
    if (e.eventType === "Other" && e.customType) return e.customType;
    return e.eventType;
  };

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
                      <Input
                        placeholder="Summer Game Fest 2025"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe your event..."
                        className="min-h-[100px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          type="date"
                          value={dateValue}
                          onChange={(e) => setDateValue(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input
                          type="time"
                          value={timeValue}
                          onChange={(e) => setTimeValue(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        placeholder="Los Angeles Convention Center"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Event Type</label>
                      <Select value={type} onValueChange={setType}>
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

                    {type === "Other" && (
                      <div>
                        <label className="text-sm font-medium">Specify Event Type</label>
                        <Input
                          placeholder="Enter custom event type"
                          value={customType}
                          onChange={(e) => setCustomType(e.target.value)}
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium">Duration (Minutes)</label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g., 120"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Maximum Attendees (Optional)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Leave empty for unlimited"
                        value={maxAttendees}
                        onChange={(e) => setMaxAttendees(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        onClick={createEvent}
                        disabled={creating}
                      >
                        {creating ? "Creating..." : "Create Event"}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {loading && eventsList.length === 0 && (
                <Card className="p-6 bg-card/50 border-border">
                  <p className="text-muted-foreground">Loading events...</p>
                </Card>
              )}

              {!loading && eventsList.length === 0 && (
                <Card className="p-6 bg-card/50 border-border">
                  <p className="text-muted-foreground">No events yet. Be the first to create one.</p>
                </Card>
              )}

              {eventsList.map((event) => {
                const dateLabel = formatDate(event.eventDate);
                const timeLabel = formatTime(event.eventDate);
                return (
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
                              {effectiveType(event)}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">
                          {event.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{dateLabel}</span>
                          </div>

                          {timeLabel && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-secondary" />
                              <span>{timeLabel}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-accent" />
                            <span>{event.location}</span>
                          </div>

                          {event.durationMinutes && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-secondary" />
                              <span>Duration: {event.durationMinutes} min</span>
                            </div>
                          )}

                          {event.maxAttendees && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-primary" />
                              <span>{event.maxAttendees} max</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
