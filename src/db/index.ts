import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// We do not run DB connecting on client-side
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL connection string is missing');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
