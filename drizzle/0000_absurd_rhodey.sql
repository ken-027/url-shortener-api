CREATE TABLE "url_shortener" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"short_code" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "url_shortener_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
CREATE INDEX "idx_url_shortener_short_code" ON "url_shortener" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "idx_url_shortener_url" ON "url_shortener" USING btree ("url");