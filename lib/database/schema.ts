import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  varchar,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

//
// USERS + AUTH
//
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});

//
// GAMIFICATION
//
export const userGamification = pgTable("user_gamification", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  totalPoints: integer("total_points").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: date("last_activity_date"),
  badges: jsonb("badges")
    .$type<string[]>()
    .default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pointsHistory = pgTable("points_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 50 }).notNull(),
  points: integer("points").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

//
// GAME LIBRARY (very important for reviews)
//
export const userLibrary = pgTable("user_library", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  gameId: integer("game_id").notNull(),
  gameName: text("game_name").notNull(),
  platform: varchar("platform", { length: 20 }).notNull(), // Steam / PS / Xbox / Epic / Manual
  playtimeHours: integer("playtime_hours").notNull().default(0),
  lastPlayed: timestamp("last_played", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

//
// REVIEWS
//
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  gameId: integer("game_id"), // linked from library
  gameName: text("game_name"),

  helpfulCount: integer("helpful_count").notNull().default(0),
  rating: integer("rating").notNull(), // 1–5
  reviewText: text("review_text"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

//
// EVENTS
//
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),

  // UI uses date + time → merged into eventDate
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),

  location: text("location").notNull(),

  eventType: varchar("event_type", { length: 50 }).notNull(),
  customType: varchar("custom_type", { length: 50 }),

  durationMinutes: integer("duration_minutes"),
  maxAttendees: integer("max_attendees"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
