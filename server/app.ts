import { Hono } from 'hono';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import type { SessionData } from '../src/type';

type MyBinding = {
  Bindings: {
    DATABASE: string,
    JWT_SECRET: string
  },
  Variables: {
    db: NeonDatabase,
    session: SessionData
  }
}

export default function app() {
  return new Hono<MyBinding>();
}
