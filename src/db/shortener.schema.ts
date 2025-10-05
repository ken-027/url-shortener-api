import { uuid } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm/table";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod/v4";

export const urlShortener = pgTable(
    "url_shortener",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        url: text("url").notNull(),
        shortCode: text("short_code").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at"),
        accessCount: integer("access_count").default(0).notNull(),
    },
    (table) => ({
        shortCodeIdx: index("idx_url_shortener_short_code").on(table.shortCode),
        urlIdx: index("idx_url_shortener_url").on(table.url),
    }),
);

export type UrlShortener = InferSelectModel<typeof urlShortener>;
export type NewUrlShortener = InferInsertModel<typeof urlShortener>;

export const insertUrlSchema = createInsertSchema(urlShortener);
export const selectUrlSchema = createSelectSchema(urlShortener);

export const urlSchema = insertUrlSchema.pick({ url: true }).extend({
    url: z.string().url("Invalid URL format"),
});
