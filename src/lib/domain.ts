type GetDomainUrlParams = {
	origin: string;
};

export const getDomainUrl = (
	resolve: string = '',
	{ origin }: GetDomainUrlParams,
) => {
	const url = new URL(
		origin.match(/^https?:\/\//) ? origin : `https://${origin}`,
	);
	url.pathname = resolve;
	return url.toString();
};
