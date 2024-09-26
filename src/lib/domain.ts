type GetDomainUrlParams = {
	domain: string;
	path: string;
};

export const getDomainUrl = ({ domain, path = '' }: GetDomainUrlParams) => {
	const url = new URL(
		domain.match(/^https?:\/\//) ? domain : `https://${domain}`,
	);
	url.pathname = path;
	return url.toString();
};
