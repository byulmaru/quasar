import { and, eq } from 'drizzle-orm';
import { firstOrThrow, getDatabase } from '$lib/database';
import { Boxes } from '$lib/database/schema';

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

	return {
		box,
	};
};
