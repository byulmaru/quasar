import { json, pgTable, text } from 'drizzle-orm/pg-core';

type OAuthAppType = 'mastodon' | 'misskey';

type OAuthAppClient = {
  id: string,
  secret: string,
}

const oAuthApp = pgTable('oauth_apps', {
  domain: text('domain').notNull().primaryKey(),
  webfingerDomain: text('webfinger_domain').notNull(),
  type: text('type').notNull().$type<OAuthAppType>(),
  client: json('client').notNull().$type<OAuthAppClient>(),
});

export default oAuthApp;