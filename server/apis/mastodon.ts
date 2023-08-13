import { HTTPException } from 'hono/http-exception';
import api from '../api';
import { scopes, makeRedirectURI } from '../constant';

type CreateAppResult = {
  client_id: string,
  client_secret: string
};

export const createApp = (instance) => api<CreateAppResult>(instance, 'POST', '/api/v1/apps', {
  client_name: 'Quasar by Planet',
  redirect_uris: makeRedirectURI(instance),
  scopes: scopes.join(' '),
  website: 'https://quasar.planet.moe'
})
.catch(() => {
  throw new HTTPException(422, {message: 'Invalid instance'});
});

type GetInstanceResult = {
  domain: string,
}

export const getInstance = (instance) => api<GetInstanceResult>(instance, 'GET', '/api/v2/instance');
