import { z } from 'zod';

export const dataValidation = {
	instance: z
		.string()
		.transform(
			(str) => new URL(str.startsWith('http') ? str : `https://${str}`).host,
		),
};
