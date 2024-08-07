import { json, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import cryptoRandomString from 'crypto-random-string';
import { datetime, id, idPk } from './types';

type OAuthAppInfo = {
	clientId: string;
	clientSecret: string;
};

export const Accounts = pgTable('accounts', {
	id: idPk('ACNT'),
	name: varchar('name').notNull(),
	avatarUrl: varchar('avatar_url'),
});

export const AccountOAuthApps = pgTable('account_oauth_apps', {
	id: idPk('AOAP'),
	accountId: varchar('account_id')
		.notNull()
		.references(() => Accounts.id),
	appId: id('app_id')
		.notNull()
		.references(() => OAuthApps.id),
	oAuthUserId: varchar('oauth_user_id').notNull(),
});

export const OAuthAppKind = pgEnum('OAuthAppKind', ['MASTODON', 'MISSKEY']);
export const OAuthApps = pgTable('oauth_apps', {
	id: idPk('OAPP'),
	instance: varchar('instance').notNull().unique(),
	kind: OAuthAppKind('kind').notNull(),
	authInfo: json('auth_info').notNull().$type<OAuthAppInfo>(),
});

export const Sessions = pgTable('sessions', {
	id: idPk('SESN'),
	accountId: varchar('account_id')
		.notNull()
		.references(() => Accounts.id),
	oAuthAppId: id('oauth_app_id').references(() => OAuthApps.id),
	oAuthAccessToken: varchar('oauth_access_token'),
	token: varchar('token')
		.notNull()
		.$default(() => cryptoRandomString({ length: 32 })),
	createdAt: datetime('created_at')
		.notNull()
		.default(sql`now()`),
	lastUsedAt: varchar('last_used_at')
		.notNull()
		.default(sql`now()`),
});
