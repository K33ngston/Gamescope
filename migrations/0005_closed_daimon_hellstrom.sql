CREATE TABLE "review_comment_stats" (
	"review_id" uuid PRIMARY KEY NOT NULL,
	"total_comments" integer DEFAULT 0 NOT NULL,
	"last_comment_at" timestamp with time zone
);
