import {
	json,
	pgEnum,
	pgTable,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core';
import { eq, sql } from 'drizzle-orm';
import cryptoRandomString from 'crypto-random-string';
import { datetime, id, idPk } from './types';

type OAuthAppInfo = {
	clientId: string;
	clientSecret: string;
};

export const AccountState = pgEnum('AccountState', [
	'ACTIVE',
	'DELETED',
	'SUSPENDED',
]);
export const Accounts = pgTable(
	'accounts',
	{
		id: idPk(),
		state: AccountState('state').notNull().default('ACTIVE'),
		slug: varchar('slug').notNull(),
		name: varchar('name').notNull(),
		avatarUrl: varchar('avatar_url'),
	},
	(t) => ({
		slugUniqueIndex: uniqueIndex().on(t.slug).where(eq(t.state, 'ACTIVE')),
	}),
);

export const AccountOAuthApps = pgTable('account_oauth_apps', {
	id: idPk(),
	accountId: id('account_id')
		.notNull()
		.references(() => Accounts.id),
	appId: id('app_id')
		.notNull()
		.references(() => OAuthApps.id),
	oAuthUserId: varchar('oauth_user_id').notNull(),
});

export const OAuthAppKind = pgEnum('OAuthAppKind', ['MASTODON', 'MISSKEY']);
export const OAuthApps = pgTable('oauth_apps', {
	id: idPk(),
	instance: varchar('instance').notNull().unique(),
	kind: OAuthAppKind('kind').notNull(),
	redirectUri: varchar('redirect_uri').notNull(),
	authInfo: json('auth_info').notNull().$type<OAuthAppInfo>(),
});

export const Sessions = pgTable('sessions', {
	id: idPk(),
	accountId: id('account_id')
		.notNull()
		.references(() => Accounts.id),
	oAuthAppId: id('oauth_app_id').references(() => OAuthApps.id),
	oAuthAccessToken: varchar('oauth_access_token'),
	token: varchar('token')
		.notNull()
		.$default(() => cryptoRandomString({ length: 32 })),
	lastUsedAt: datetime('last_used_at')
		.notNull()
		.default(sql`now()`),
});
