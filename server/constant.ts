export const scopes = ['read:accounts', 'read:follows', 'write:statuses', 'write:media'];
export function makeRedirectURI(instance: string) {
  return `https://quasar.planet.moe/api/auth/mastodon/${instance}/callback`;
}
