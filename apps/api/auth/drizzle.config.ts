import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL!);
const [username, password] = dbUrl.username ? dbUrl.username.split(':') : [];

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '5432'),
    user: decodeURIComponent(username || ''),
    password: decodeURIComponent(password || ''),
    database: dbUrl.pathname.slice(1), // Remove leading '/'
    ssl: dbUrl.searchParams.get('sslmode') === 'require',
  },
} satisfies Config;
