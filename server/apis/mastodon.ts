import { HTTPException } from 'hono/http-exception';
import api from '../api';
import { scopes, redirectURI } from '../constant';

type Profile = {
  id: string,
  username: string,
  avatar: string,
  note: string,
  display_name: string,
}

type CreateAppResult = {
  client_id: string,
  client_secret: string
};

export const createApp = (instance: string) => api<CreateAppResult>(instance, 'POST', '/api/v1/apps', {
  client_name: 'Quasar by Planet',
  redirect_uris: redirectURI,
  scopes: scopes.join(' '),
  website: 'https://quasar.planet.moe'
})
.catch(() => {
  throw new HTTPException(422, {message: 'Invalid instance'});
});

type GetInstanceResult = {
  domain: string,
}

export const getInstance = (instance: string) => api<GetInstanceResult>(instance, 'GET', '/api/v2/instance');

type CreateOAuthTokenResult = {
  access_token: string,
};

export const createOAuthToken = (instance: string, client: { id: string, secret: string }, code: string) => api<CreateOAuthTokenResult>(instance, 'POST', '/oauth/token', {
  grant_type: 'authorization_code',
  code,
  client_id: client.id,
  client_secret: client.secret,
  redirect_uri: redirectURI,
  scope: scopes.join(' '),
});

export const getProfileByToken = (instance: string, token: string) => 
  api<Profile>(instance, 'GET', '/api/v1/accounts/verify_credentials', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
;
