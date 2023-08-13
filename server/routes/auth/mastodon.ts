import { InferModel, eq } from 'drizzle-orm';
import app from '../../app';
import oAuthAppTable from '../../schema/oauth-app';
import { HTTPException } from 'hono/http-exception';
import api from '../../api';
import { createApp, getInstance } from '../../apis/mastodon';
import { scopes, makeRedirectURI } from '../../constant';

type MastodonOAuthTokenResult = {
  access_token: string,
};

const router = app();

router.get('/:instance', async(ctx) => {
  const instance = ctx.req.param('instance');
  const db = ctx.get('db');
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
  return ctx.json({
    url: `https://${instance}/oauth/authorize?client_id=${oAuthApp.client.id}&redirect_uri=${encodeURIComponent(makeRedirectURI(instance))}&response_type=code&scope=${scopes.join('+')}`
  });
});

router.get('/:instance/callback', async(ctx) => {
  const instance = ctx.req.param('instance');
  const code = ctx.req.query('code');
});

export default router;