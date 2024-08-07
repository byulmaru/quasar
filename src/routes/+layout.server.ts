import { eq } from 'drizzle-orm';
import { first, getDatabase } from '$lib/database';
import { Accounts, Sessions } from '$lib/database/schema.js';

export const load = async (req) => {
	const session = req.cookies.get('session');

	if (!session) {
		return;
	}

	const db = getDatabase(req);
	const user = await db
		.select({
			name: Accounts.name,
			avatarUrl: Accounts.avatarUrl,
		})
		.from(Accounts)
		.innerJoin(Sessions, eq(Sessions.accountId, Accounts.id))
		.where(eq(Sessions.token, session))
		.then(first);

	return { user };
};
