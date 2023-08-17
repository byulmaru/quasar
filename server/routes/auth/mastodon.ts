import { InferModel, eq } from 'drizzle-orm';
import app from '../../app';
import oAuthAppTable from '../../schema/oauth-app';
import { HTTPException } from 'hono/http-exception';
import { createApp, getInstance, createOAuthToken, getProfileByToken } from '../../apis/mastodon';
import { scopes, redirectURI } from '../../constant';
import profileTable from '../../schema/profile';
import { SignJWT } from 'jose';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

const router = app();

router.get('/', async(ctx) => {
  const instance = ctx.req.query('instance');
  const db = ctx.get('db');
  if(!instance) throw new HTTPException(422, {message: 'Invalid instance'});
  let oAuthApp = (await ctx.get('db').select().from(oAuthAppTable).where(
    eq(oAuthAppTable.domain, instance)
  ))[0];
  if(!oAuthApp || oAuthApp.type !== 'mastodon') {
    await createApp(instance)
    .then(
      async(res) => {
        const insertData: InferModel<typeof oAuthAppTable> = {
          domain: instance,
          webfingerDomain: (await getInstance(instance)).domain,
          type: 'mastodon',
          client: {
            id: res.client_id,
            secret: res.client_secret,
          }
        }
        return db.insert(oAuthAppTable).values(insertData)
        .onConflictDoUpdate({
          target: oAuthAppTable.domain,
          set: insertData
        })
        .returning()
      }
    )
    .then(insertedApp => {
      oAuthApp = insertedApp[0];
    })
    .catch((err) => {
      console.error(err);
      throw new HTTPException(500, {message: 'Internal Server Error'});
    });
  }
  setCookie(ctx, 'oAuthInstance', instance, { httpOnly: true });
  return ctx.redirect(
    `https://${instance}/oauth/authorize?client_id=${oAuthApp.client.id}&redirect_uri=${encodeURIComponent(redirectURI)}&response_type=code&scope=${scopes.join('+')}&force_login=${!!ctx.req.query('forceLogin')}`
  );
});

router.get('/callback', async(ctx) => {
  const instance = getCookie(ctx, 'oAuthInstance');
  const code = ctx.req.query('code');

  if(!instance) throw new HTTPException(403, {message: 'Forbidden'});

  const oAuthApp = (await ctx.get('db').select().from(oAuthAppTable).where(
    eq(oAuthAppTable.domain, instance)
  ))[0];
  if(!oAuthApp || oAuthApp.type !== 'mastodon') {
    throw new HTTPException(422, {message: 'Invalid instance'});
  }
  const accessToken = (await createOAuthToken(instance, oAuthApp.client, code!)).access_token;
  const credentials = await getProfileByToken(instance, accessToken);
  const insertData: InferModel<typeof profileTable> = {
    acct: `${credentials.username}@${oAuthApp.webfingerDomain}`,
    name: credentials.display_name,
    accessToken,
    data: {
      avatar: credentials.avatar,
      note: credentials.note,
    }
  }
  await ctx.get('db').insert(profileTable).values(insertData)
  .onConflictDoUpdate({
    target: profileTable.acct,
    set: insertData
  });
  const jwt = await new SignJWT({
    acct: insertData.acct,
    name: insertData.name,
    avatar: insertData.data.avatar,
  })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('1h')
  .sign(new TextEncoder().encode(ctx.env.JWT_SECRET));
  setCookie(ctx, 'token', jwt, { path: '/', maxAge: 3600 });
  deleteCookie(ctx, 'oAuthInstance');
  return ctx.redirect('/');
});

export default router;