import axios from 'axios';

const generateAccessToken = async (): Promise<string | undefined | null> => {
  const params = new URLSearchParams();
  params.append('client_id', 'admin-cli');
  params.append('grant_type', 'password');
  params.append('username', <string>process.env.USER);
  params.append('password', <string>process.env.PASSWD);
  const token = await axios.post(
    `${process.env.KEY_HOST}/realms/master/protocol/openid-connect/token`,
    params,
    { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
  );
  return token.data?.access_token;
};

export default generateAccessToken;
