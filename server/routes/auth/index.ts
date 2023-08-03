import app from '../../app';
import mastodonRouter from './mastodon';

const router = app();

router.route('/mastodon', mastodonRouter);

export default router;