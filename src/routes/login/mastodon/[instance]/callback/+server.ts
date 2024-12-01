import { and, eq } from 'drizzle-orm';
import ky from 'ky';
import { first, firstOrThrow, getDatabase } from '$lib/database';
import {
	AccountOAuthApps,
	Accounts,
	Boxes,
	OAuthApps,
	Sessions,
} from '$lib/database/schema';
import { getDomainUrl } from '$lib/domain';
import { dataValidation } from '$lib/validation';

type OAuthToken = {
	access_token: string;
};

type OAuthUser = {
	id: string;
	username: string;
	display_name: string;
	avatar: string;
};

export const GET = async (req) => {
	const db = getDatabase(req);
	const instance = await dataValidation.instance
		.safeParseAsync(req.params.instance)
		.then((result) => {
			if (result.success) {
				return result.data;
			}

			throw new Error();
		});

	const code = req.url.searchParams.get('code');

	if (!code) {
		throw new Error();
	}

	// 1. 액세스 토큰 발급

	const app = await db
		.select({
			id: OAuthApps.id,
			authInfo: OAuthApps.authInfo,
			redirectUri: OAuthApps.redirectUri,
		})
		.from(OAuthApps)
		.where(
			and(eq(OAuthApps.instance, instance), eq(OAuthApps.kind, 'MASTODON')),
		)
		.then(firstOrThrow);

	const accessToken = await ky
		.post<OAuthToken>(`https://${instance}/oauth/token`, {
			json: {
				grant_type: 'authorization_code',
				code,
				client_id: app.authInfo.clientId,
				client_secret: app.authInfo.clientSecret,
				redirect_uri:
					getDomainUrl({
						domain: req.platform!.env.WEB_DOMAIN,
						path: `/login/mastodon/${instance}/callback`,
					}) === app.redirectUri
						? app.redirectUri
						: 'urn:ietf:wg:oauth:2.0:oob',
			},
		})
		.json()
		.then((res) => res.access_token);

	// 2. 사용자 정보 획득

	const user = await ky
		.get<OAuthUser>(`https://${instance}/api/v1/accounts/verify_credentials`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		.json();

	const oAuthAccountId = await (async () => {
		const account = await db
			.select({ accountId: AccountOAuthApps.accountId })
			.from(AccountOAuthApps)
			.where(
				and(
					eq(AccountOAuthApps.appId, app.id),
					eq(AccountOAuthApps.oAuthUserId, user.id),
				),
			)
			.then(first);

		if (account) {
			return account.accountId;
		}
		else {
			// 3-1. 처음 가입하는 경우 -> 새로운 사용자 생성

			const newAccount = await db
				.insert(Accounts)
				.values({
					name: user.display_name,
					avatarUrl: user.avatar,
				})
				.returning({ id: Accounts.id })
				.then(firstOrThrow);

			await db
				.insert(AccountOAuthApps)
				.values({
					accountId: newAccount.id,
					appId: app.id,
					oAuthUserId: user.id,
				})
				.returning({ accountId: AccountOAuthApps.accountId })
				.then(firstOrThrow);

			await db
				.insert(Boxes)
				.values({
					accountId: newAccount.id,
					name: `${user.display_name}의 질문 상자`,
					slug: `${user.username}-${Math.floor(Math.random() * 1000000)
						.toString()
						.padStart(6, '0')}`,
				})
				.returning({ id: Boxes.id })
				.then(firstOrThrow);

			return newAccount.id;
		}
	})();

	// 4. 세션 생성

	const token = await db
		.insert(Sessions)
		.values({
			accountId: oAuthAccountId,
			oAuthAppId: app.id,
			oAuthAccessToken: accessToken,
		})
		.returning({ token: Sessions.token })
		.then((rows) => rows[0].token);

	req.cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30,
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/',
		},
	});
};
