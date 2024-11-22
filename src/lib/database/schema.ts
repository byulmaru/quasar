import {
	index,
	json,
	pgEnum,
	pgTable,
	text,
	varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import cryptoRandomString from 'crypto-random-string';
import { datetime, id, idPk } from './types';

type OAuthAppInfo = {
	clientId: string;
	clientSecret: string;
};

/**
 * Enums
 */

export const AccountState = pgEnum('AccountState', [
	'ACTIVE',
	'DELETED',
	'SUSPENDED',
]);

export const BoxState = pgEnum('BoxState', [
	'PUBLIC',
	'PRIVATE',
	'SUSPENDED',
	'DELETED',
]);

export const BoxMemberRole = pgEnum('BoxMemberRole', [
	'OWNER',
	'ADMIN',
	'MEMBER',
]);

export const OAuthAppKind = pgEnum('OAuthAppKind', ['MASTODON', 'MISSKEY']);

/**
 * Tables
 */

export const Accounts = pgTable('accounts', {
	id: idPk(),
	state: AccountState('state').notNull().default('ACTIVE'),
	name: varchar('name').notNull(),
	avatarUrl: varchar('avatar_url'),
});

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

export const Boxes = pgTable(
	'boxes',
	{
		id: idPk(),
		state: BoxState('state').notNull().default('PUBLIC'),
		slug: varchar('slug').notNull(),
		name: varchar('name').notNull(),
		description: text('description'),
	},
	(t) => ({
		slugUniqueIndex: index()
			.on(t.slug)
			.where(sql`${t.state} <> 'DELETED'`),
	}),
);

export const BoxMembers = pgTable('box_members', {
	id: idPk(),
	boxId: id('box_id').references(() => Boxes.id),
	accountId: id('account_id').references(() => Accounts.id),
	role: BoxMemberRole('role').notNull(),
});

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
