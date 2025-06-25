import { NextApiHandler } from 'next';
import { PhoneCodeListResponse } from '../../../../src/api/mdp/types';
import { errorResponse } from '../../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (_, res) => {
  try {
    const result = await client.get<PhoneCodeListResponse[]>(`/mdp-api/api/contact/countries`);
    res.status(result.status).json(result.data);
  } catch (error) {
    errorResponse(error, res);
  }
});

export default handler;
