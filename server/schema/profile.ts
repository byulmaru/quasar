import { json, pgTable, text } from 'drizzle-orm/pg-core';

type ProfileData = {
  avatar: string,
  note: string, 
}

const profile = pgTable('profiles', {
  acct: text('acct').notNull().primaryKey(),
  name: text('name').notNull(),
  accessToken: text('access_token'),
  data: json('data').notNull().$type<ProfileData>(),
});

export default profile;
