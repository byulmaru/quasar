import app from './app';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import authRouter from './routes/auth';

const router = app();

router.use('*', async(ctx, next) => {
  const pool = new Pool({ connectionString: ctx.env.DATABASE });
  ctx.set('db', drizzle(pool));
  await next();
  ctx.executionCtx.waitUntil(pool.end());
});

router.route('/auth', authRouter);

export default router;
