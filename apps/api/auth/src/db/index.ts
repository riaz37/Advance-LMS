import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import * as schema from './schema';

export const createDrizzle = (configService: ConfigService) => {
  const pool = new Pool({
    connectionString: configService.get('DATABASE_URL'),
  });

  return drizzle(pool, { schema });
};
