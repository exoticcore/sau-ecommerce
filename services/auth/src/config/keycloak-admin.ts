import { KeycloakAdminClient } from '@keycloak/keycloak-admin-client/lib/client.js';
import { Issuer } from 'openid-client';
import { redis } from './redis.js';

const keycloakIssuer = await Issuer.discover(
  `${process.env.KC_HOST}/realms/master`
);

const client = new keycloakIssuer.Client({
  client_id: 'admin-cli',
  token_endpoint_auth_method: 'none',
});

// let revokeToken = await client.grant({
//   grant_type: 'password',
//   username: <string>process.env.KC_ADMIN_USER,
//   password: <string>process.env.KC_ADMIN_PWD,
//   scope: 'offline_access',
// });

// await client.revoke(<string>revokeToken.refresh_token);

let tokenSet = await client.grant({
  grant_type: 'password',
  username: <string>process.env.KC_ADMIN_USER,
  password: <string>process.env.KC_ADMIN_PWD,
  scope: 'offline_access',
});

const kcAdmin = new KeycloakAdminClient({
  baseUrl: <string>process.env.KC_HOST,
  realmName: 'master',
});

await kcAdmin.auth({
  grantType: 'refresh_token',
  clientId: 'admin-cli',
  refreshToken: tokenSet.refresh_token,
});

setInterval(async () => {
  const refreshToken = tokenSet.refresh_token;
  tokenSet = await client.refresh(<string>refreshToken);
  kcAdmin.setAccessToken(<string>tokenSet.access_token);
}, 60 * 1000);

kcAdmin.setConfig({
  realmName: <string>process.env.KC_REALMS,
});

export default kcAdmin;
