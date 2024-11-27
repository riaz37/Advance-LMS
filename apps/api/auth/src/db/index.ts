import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { ConfigService } from '@nestjs/config';
import * as schema from './schema';

export const createDrizzle = (configService: ConfigService) => {
  const dbUrl = configService.get<string>('DATABASE_URL');
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
};
