import db from "@/config/db.connection";
import { UrlShortener, urlShortener } from "./shortener.schema";
import { eq, sql } from "drizzle-orm";
import { encodeUrlToShortCode } from "@/utils/crypto.util";
import { NotFoundError } from "@/errors/not-found.error";

export default class ShortenerDAO {
    private connection;
    constructor() {
        this.connection = db;
    }

    async addUrl(url: string): Promise<UrlShortener> {
        const shortCode = encodeUrlToShortCode(url);

        const [existing] = await db
            .select()
            .from(urlShortener)
            .where(eq(urlShortener.shortCode, shortCode));

        const [newUrl] = await this.connection
            .insert(urlShortener)
            .values({ url, shortCode })
            .onConflictDoNothing({ target: urlShortener.shortCode })
            .returning();

        return newUrl || existing;
    }

    async getUrl(
        shortCode: string,
        updateStats?: boolean,
    ): Promise<UrlShortener> {
        const [url] = await this.connection
            .select()
            .from(urlShortener)
            .where(eq(urlShortener.shortCode, shortCode));

        if (!url) throw new NotFoundError("URL not found");

        if (updateStats) {
            await this.connection
                .update(urlShortener)
                .set({ accessCount: sql`${urlShortener.accessCount} + 1` })
                .where(eq(urlShortener.id, url.id));
        }

        return url;
    }

    async deleteUrl(shortCode: string): Promise<void> {
        const result = await this.connection
            .delete(urlShortener)
            .where(eq(urlShortener.shortCode, shortCode))
            .returning();

        if (result.length === 0) throw new NotFoundError("URL already deleted");
    }

    async updateUrl(
        shortCode: string,
        url: string,
    ): Promise<Omit<UrlShortener, "accessCount">> {
        const [updatedUrl] = await this.connection
            .update(urlShortener)
            .set({ url, updatedAt: new Date() })
            .where(eq(urlShortener.shortCode, shortCode))
            .returning();

        if (!updatedUrl)
            throw new NotFoundError("Failed to update — URL not found");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { accessCount, ...newUpdatedUrl } = updatedUrl;

        return newUpdatedUrl;
    }
}
