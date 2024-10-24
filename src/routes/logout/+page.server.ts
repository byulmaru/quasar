import { eq } from 'drizzle-orm';
import { getDatabase } from '$lib/database';
import { Sessions } from '$lib/database/schema';

export const actions = {
	default: async (req) => {
		const session = await req.cookies.get('session');
		if (session) {
			const db = getDatabase(req);
			await db
				.delete(Sessions)
				.where(eq(Sessions.token, session))
				.catch(() => null);

			req.cookies.delete('session', { path: '/' });
		}
	},
};
