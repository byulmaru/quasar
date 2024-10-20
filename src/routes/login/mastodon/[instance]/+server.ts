import { and, eq } from 'drizzle-orm';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import ky from 'ky';
import qs from 'query-string';
import { OAuthApps } from '$lib/database/schema';
import { first, firstOrThrow, getDatabase } from '$lib/database';
import { getDomainUrl } from '$lib/domain';
import { MASTODON_OAUTH_SCOPE } from '$lib/oauth';

type CreateOAuthAppResponse = {
	client_id: string;
	client_secret: string;
};

type CreateOAuthAppParams = {
	instance: string;
	db: NeonHttpDatabase;
	domain: string;
};

const createOAuthApp = async ({
	instance,
	db,
	domain,
}: CreateOAuthAppParams) => {
	const redirectUri = getDomainUrl({
		domain,
		path: `/login/mastodon/${instance}/callback`,
	});

	const response = await ky
		.post<CreateOAuthAppResponse>(`https://${instance}/api/v1/apps`, {
			json: {
				client_name: 'Quasar',
				redirect_uris: [redirectUri, 'urn:ietf:wg:oauth:2.0:oob'],
				scopes: MASTODON_OAUTH_SCOPE,
			},
		})
		.json();

	const app = {
		clientId: response.client_id,
		clientSecret: response.client_secret,
	};

	return await db
		.insert(OAuthApps)
		.values({
			instance,
			authInfo: app,
			kind: 'MASTODON',
			redirectUri,
		})
		.returning()
		.then(firstOrThrow);
};

export const GET = async (req) => {
	const db = getDatabase(req);
	const instance = req.params.instance;

	const app = await db
		.select()
		.from(OAuthApps)
		.where(
			and(eq(OAuthApps.kind, 'MASTODON'), eq(OAuthApps.instance, instance)),
		)
		.then(first)
		.then(
			(app) =>
				app ??
				createOAuthApp({ instance, db, domain: req.platform!.env.WEB_DOMAIN }),
		);

	return new Response(null, {
		status: 302,
		headers: {
			Location: qs.stringifyUrl({
				url: getDomainUrl({ domain: instance, path: '/oauth/authorize' }),
				query: {
					response_type: 'code',
					client_id: app.authInfo.clientId,
					redirect_uri:
						getDomainUrl({
							domain: req.platform!.env.WEB_DOMAIN,
							path: `/login/mastodon/${instance}/callback`,
						}) === app.redirectUri
							? app.redirectUri
							: 'urn:ietf:wg:oauth:2.0:oob',
					scope: MASTODON_OAUTH_SCOPE,
				},
			}),
		},
	});
};
