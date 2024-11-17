import { and, eq } from 'drizzle-orm';
import { firstOrThrow, getDatabase } from '$lib/database';
import { Accounts } from '$lib/database/schema';

export const load = async (req) => {
	const db = getDatabase(req);
	const account = await db
		.select({
			id: Accounts.id,
			name: Accounts.name,
			avatarUrl: Accounts.avatarUrl,
		})
		.from(Accounts)
		.where(
			and(eq(Accounts.slug, req.params.slug), eq(Accounts.state, 'ACTIVE')),
		)
		.then(firstOrThrow);

	return {
		account,
	};
};
