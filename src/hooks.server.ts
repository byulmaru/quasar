import { render } from '@master/css-server';
import config from '../master.css';

export const handle = async ({ event, resolve }) => {
	return await resolve(event, {
		transformPageChunk: ({ html }) => render(html, config).html,
	});
};
