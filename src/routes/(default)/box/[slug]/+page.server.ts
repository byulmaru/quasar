import { and, eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { firstOrThrow, getDatabase } from '$lib/database';
import { Boxes, Questions } from '$lib/database/schema';
import { getAccountFromSession } from '$lib/user';

const questionSchema = z.object({
	question: z
		.string()
		.min(1, '질문을 입력해주세요')
		.max(500, '최대 500자까지 입력할 수 있어요'),
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

	const form = await superValidate(zod(questionSchema));

	return {
		box,
		form,
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(questionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const db = getDatabase(event);

		const me = await getAccountFromSession(event);

		if (!me) {
			return fail(401, { form });
		}

		const box = await db
			.select({
				id: Boxes.id,
			})
			.from(Boxes)
			.where(eq(Boxes.slug, event.params.slug))
			.then(firstOrThrow);

		await db.insert(Questions).values({
			boxId: box.id,
			question: form.data.question,
			accountId: me.id,
			questionerVisibility: 'PRIVATE',
		});

		return { form };
	},
};
