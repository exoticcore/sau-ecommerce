import { Issuer } from 'openid-client';

const issuer = await Issuer.discover(
  `${process.env.KC_HOST}/realms/${process.env.KC_REALMS}`
);

const openIdClient = new issuer.Client({
  client_id: <string>process.env.KC_CLIENT_ID,
  client_secret: <string>process.env.KC_CLIENT_SECRET,
});

export default openIdClient;
