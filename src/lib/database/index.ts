import { neon } from '@neondatabase/serverless';
import type { RequestEvent } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/neon-http';

export const getDatabase = (req: RequestEvent) =>
	drizzle(neon(req.platform!.env.DB_URL));

export const first = <T>(result: T[]): T | undefined => result[0];
export const firstOrThrow = <T>(result: T[]): T => {
	if (result?.[0]) {
		return result[0];
	}
	throw new Error('not found');
};
