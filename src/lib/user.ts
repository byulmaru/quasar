import type { RequestEvent } from '@sveltejs/kit';
import { eq, getTableColumns } from 'drizzle-orm';
import { first, getDatabase } from './database';
import { Accounts, Sessions } from './database/schema';

export const getAccountFromSession = async (event: RequestEvent) => {
	const db = getDatabase(event);

	const token = event.cookies.get('session');

	if (!token) {
		return;
	}

	const account = await db
		.select(getTableColumns(Accounts))
		.from(Accounts)
		.innerJoin(Sessions, eq(Sessions.accountId, Accounts.id))
		.where(eq(Sessions.token, token))
		.then(first);

	return account;
};
