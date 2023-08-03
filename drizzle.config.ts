import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({path: './.dev.vars'});

export default {
  schema: './server/schema/*',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: `${process.env.DATABASE}?sslmode=require`,
  }
} satisfies Config;