import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export const useMemoryStorage = !process.env.DATABASE_URL;

// Only create a real database connection if DATABASE_URL is provided
let pool, db;
if (!useMemoryStorage) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    console.warn("Falling back to in-memory storage");
  }
} else {
  console.warn("DATABASE_URL not set. Using in-memory storage.");
}

export { pool, db };
