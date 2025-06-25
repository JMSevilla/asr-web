import { NextApiHandler } from 'next';
import { RefreshParams } from '../../../src/api/authentication/types';
import { errorResponse } from '../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
  const body = { accessToken: req.session.accessToken, refreshToken: req.session.refreshToken };
  try {
    const result = await client.post<RefreshParams>(
      `/authentication-api/api/bereavement/email/verified/exchange-token`,
      body,
    );
    req.session.accessToken = result.data.accessToken;
    req.session.refreshToken = result.data.refreshToken;
    await req.session.save();
    res.status(result.status).json(result.data);
  } catch (error) {
    req.session.destroy();
    errorResponse(error, res);
  }
});

export default handler;
