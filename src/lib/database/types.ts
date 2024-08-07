import dayjs from 'dayjs';
import { customType, varchar } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const datetime = customType<{ data: dayjs.Dayjs; driverData: string }>({
	dataType: () => 'timestamp with time zone',
	fromDriver: (value) => dayjs(value),
	toDriver: (value) => value.toISOString(),
});

export const id = varchar;

export const idPk = (prefix: string) =>
	varchar('id')
		.primaryKey()
		.$defaultFn(() => `${prefix}${ulid()}`);

export const createdAt = (name: string = 'created_at') =>
	datetime(name).$defaultFn(() => dayjs());
