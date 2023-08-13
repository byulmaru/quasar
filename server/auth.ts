import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { jwtVerify } from 'jose';

export function getSession(authRequired: boolean = true) {
  return async(ctx: Context, next: Next) => {
    const cookie = getCookie(ctx, 'token');
    if(cookie) {
      try {
        const token = await jwtVerify(cookie, new TextEncoder().encode(ctx.env.JWT_SECRET));
        ctx.set('session', token);
        console.log(JSON.stringify(token));
      }
      catch(e) {
        console.error(JSON.stringify(e));
      }
    }
    if(authRequired && !ctx.get('session')) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
    return next();
  };
}