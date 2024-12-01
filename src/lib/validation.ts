import { z } from 'zod';

export const dataValidation = {
	instance: z.string().transform((str, ctx) => {
		const domain = str.match(
			/^(?:https?:(?:\/\/)?)?([\w\d-]+(?:\.[\w\d-]+))/,
		)?.[1];

		if (!domain) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: '서버 주소가 형식에 맞지 않아요',
			});

			return z.NEVER;
		}

		return domain;
	}),
};
