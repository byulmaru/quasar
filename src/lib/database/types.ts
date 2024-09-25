import dayjs from 'dayjs';
import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/pg-core';

export const datetime = customType<{ data: dayjs.Dayjs; driverData: string }>({
	dataType: () => 'timestamp with time zone',
	fromDriver: (value) => dayjs(value),
	toDriver: (value) => value.toISOString(),
});

export const id = customType<{ data: string; driverData: string }>({
	dataType: () => 'ulid',
	fromDriver: (value) => value,
	toDriver: (value) => value,
});

export const idPk = (name: string = 'id') =>
	id(name)
		.primaryKey()
		.default(sql`gen_ulid()`);

export const createdAt = (name: string = 'created_at') =>
	datetime(name).default(sql`now()`);
