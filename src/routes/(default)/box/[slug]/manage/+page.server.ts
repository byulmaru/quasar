import { and, eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { firstOrThrow, getDatabase } from '$lib/database';
import { Boxes } from '$lib/database/schema';

const boxManageSchema = z.object({
	name: z
		.string()
		.min(1, '이름을 입력해주세요')
		.max(12, '최대 12글자까지 입력할 수 있어요'),
	slug: z
		.string()
	    .regex(/^[a-z0-9-]+$/, '영문, 숫자, 하이픈(-)만 사용할 수 있어요')
		.min(3, '3글자 이상 입력해 주세요')
		.max(20, '최대 20글자까지 입력할 수 있어요')
});

export const load = async (req) => {
	const db = getDatabase(req);
	const box = await db
		.select({
			name: Boxes.name,
			state: Boxes.state,
			slug: Boxes.slug,
			description: Boxes.description,
		})
		.from(Boxes)
		.where(and(eq(Boxes.slug, req.params.slug), eq(Boxes.state, 'PUBLIC')))
		.then(firstOrThrow);

	const form = await superValidate({
		name: box.name,
		slug: box.slug
	}, zod(boxManageSchema));

	return {
		box,
		form,
	};
};