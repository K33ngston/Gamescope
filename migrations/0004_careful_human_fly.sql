CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_date" date NOT NULL,
	"event_time" varchar(10) NOT NULL,
	"location" text NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"custom_type" varchar(100),
	"duration_minutes" integer,
	"max_attendees" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
