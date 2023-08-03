import { Hono } from 'hono';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';

type MyBinding = {
  Bindings: {
    DATABASE: string
  },
  Variables: {
    db: NeonDatabase
  }
}

export default function app() {
  return new Hono<MyBinding>();
}
