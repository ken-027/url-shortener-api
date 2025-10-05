import { Pool } from "pg";
import { DB_URL, NODE_ENV } from "./env";
import { drizzle } from "drizzle-orm/node-postgres";

export const pool = new Pool({
    connectionString: DB_URL,
    ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const db = drizzle({ client: pool });

export default db;
