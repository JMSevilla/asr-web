import { NextApiHandler } from 'next';
import { LoginResponse } from '../../../src/api/authentication/types';
import { errorResponse } from '../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
  try {
    const serviceUuidJson = process.env.SERVICE_UUID as string;
    const serviceUuid = JSON.parse(serviceUuidJson);
    const bereavementUuid = serviceUuid.bereavement;

    const authorizationHeader = `Basic ${Buffer.from(bereavementUuid).toString('base64')}`;

    const config = {
      headers: {
        'X-Custom-Authorization': authorizationHeader,
      },
    };

    const result = await client.post<LoginResponse>(`/authentication-api/api/bereavement/login`, req.body, config);

    req.session.accessToken = result.data.accessToken;
    req.session.refreshToken = result.data.refreshToken;
    await req.session.save();
    res.status(result.status).end(result.statusText);
  } catch (error) {
    req.session.destroy();
    errorResponse(error, res);
  }
});

export default handler;
