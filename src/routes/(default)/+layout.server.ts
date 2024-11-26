import { eq } from 'drizzle-orm';
import { getDatabase } from '$lib/database';
import { Boxes } from '$lib/database/schema';
import { getAccountFromSession } from '$lib/user';

export const load = async (req) => {
	const account = await getAccountFromSession(req);

	if (account) {
		const db = getDatabase(req);

		const boxes = await db
			.select()
			.from(Boxes)
			.where(eq(Boxes.accountId, account.id));

		return {
			account,
			boxes,
		};
	}
};
