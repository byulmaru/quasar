import { and, eq } from 'drizzle-orm';
import ky from 'ky';
import { first, firstOrThrow, getDatabase } from '$lib/database';
import {
	AccountOAuthApps,
	Accounts,
	OAuthApps,
	Sessions,
} from '$lib/database/schema.js';
import { getDomainUrl } from '$lib/domain';

type OAuthToken = {
	access_token: string;
};

type OAuthUser = {
	id: string;
	display_name: string;
	avatar: string;
};

export const GET = async (req) => {
	const db = getDatabase(req);
	const instance = req.params.instance;
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
			// 3-1. 이미 가입한 경우 -> 사용자 정보 업데이트
			db.update(Accounts)
				.set({
					name: user.display_name,
					avatarUrl: user.avatar,
				})
				.where(eq(Accounts.id, account.accountId));

			return account.accountId;
		}

		// 3-2. 처음 가입하는 경우 -> 새로운 사용자 생성

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

		return newAccount.id;
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
