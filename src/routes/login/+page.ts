import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { dataValidation } from '$lib/validation';

export const load = async () => {
	const form = await superValidate(
		zod(
			z.object({
				instance: dataValidation.instance,
			}),
		),
	);

	return {
		form,
	};
};
