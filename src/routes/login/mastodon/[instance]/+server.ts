import { and, eq } from 'drizzle-orm';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import ky from 'ky';
import qs from 'query-string';
import { OAuthApps } from '$lib/database/schema';
import { first, getDatabase } from '$lib/database';
import { getDomainUrl } from '$lib/domain';
import { MASTODON_OAUTH_SCOPE } from '$lib/oauth';

type CreateOAuthAppResponse = {
	client_id: string;
	client_secret: string;
};

type CreateOAuthAppParams = {
	instance: string;
	db: NeonHttpDatabase;
	origin: string;
};

const createOAuthApp = async ({
	instance,
	db,
	origin,
}: CreateOAuthAppParams) => {
	const response = await ky
		.post<CreateOAuthAppResponse>(`https://${instance}/api/v1/apps`, {
			json: {
				client_name: 'Quasar',
				redirect_uris: getDomainUrl(`/login/mastodon/${instance}/callback`, {
					origin,
				}),
				scopes: MASTODON_OAUTH_SCOPE,
			},
		})
		.json();

	const app = {
		clientId: response.client_id,
		clientSecret: response.client_secret,
	};

	await db.insert(OAuthApps).values({
		instance,
		authInfo: app,
		kind: 'MASTODON',
	});

	return app;
};

export const GET = async (req) => {
	const db = getDatabase(req);
	const instance = req.params.instance;

	const appDbData = await db
		.select()
		.from(OAuthApps)
		.where(
			and(eq(OAuthApps.kind, 'MASTODON'), eq(OAuthApps.instance, instance)),
		)
		.then(first);

	const app = appDbData
		? appDbData.authInfo
		: await createOAuthApp({ instance, db, origin: req.url.origin });

	return new Response(null, {
		status: 302,
		headers: {
			Location: qs.stringifyUrl({
				url: getDomainUrl('/oauth/authorize', { origin: instance }),
				query: {
					response_type: 'code',
					client_id: app.clientId,
					redirect_uri: getDomainUrl(`/login/mastodon/${instance}/callback`, {
						origin: req.url.origin,
					}),
					scope: MASTODON_OAUTH_SCOPE,
				},
			}),
		},
	});
};
