import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import router from '../../server/route';

const app = new Hono().basePath('/api');

app.route('/', router);



export const onRequest = handle(app);
