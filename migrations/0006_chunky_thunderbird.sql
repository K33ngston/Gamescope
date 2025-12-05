ALTER TABLE "review_comment_stats" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "review_votes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "review_comment_stats" CASCADE;--> statement-breakpoint
DROP TABLE "review_votes" CASCADE;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "custom_type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "game_id" integer;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "game_name" text;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "event_time";