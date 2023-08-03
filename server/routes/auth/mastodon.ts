import { eq } from 'drizzle-orm';
import app from '../../app';
import oAuthAppTable from '../../schema/oauth-app';
import { HTTPException } from 'hono/http-exception';
import api from '../../api';

type MastodonAppCreateResult = {
  client_id: string,
  client_secret: string
};

const router = app();

router.get('/:instance', async(ctx) => {
  const instance = ctx.req.param('instance');
  const db = ctx.get('db');
  let oAuthApp = (await ctx.get('db').select().from(oAuthAppTable).where(
    eq(oAuthAppTable.domain, instance)
  ))[0];
  if(!oAuthApp || oAuthApp.type !== 'mastodon') {
    await api<MastodonAppCreateResult>(instance, 'POST', '/api/v1/apps', {
      client_name: 'Quasar by Planet',
      redirect_uris: `https://quasar.planet.moe/api/auth/mastodon/${instance}/callback`,
      scopes: 'read:accounts read:follows write:statuses write:media',
      website: 'https://quasar.planet.moe'
    })
    .catch(() => {
      throw new HTTPException(422, {message: 'Invalid instance'});
    })
    .then(
      (res) => db.insert(oAuthAppTable).values({
        domain: instance,
        type: 'mastodon',
        client: {
          id: res.client_id,
          secret: res.client_secret,
        }
      })
      .onConflictDoUpdate({
        target: oAuthAppTable.domain,
        set: {
          type: 'mastodon',
          client: {
            id: res.client_id,
            secret: res.client_secret,
          }
        }
      })
      .returning()
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
    url: `https://${instance}/oauth/authorize?client_id=${oAuthApp.client.id}&redirect_uri=https://quasar.planet.moe/auth/mastodon/${instance}/callback&response_type=code&scope=read:accounts+read:follows+write:statuses+write:media`
  });
});

router.get('/:instance/callback', async(ctx) => {
  const instance = ctx.req.param('instance');
  const code = ctx.req.query('code');
});

export default router;