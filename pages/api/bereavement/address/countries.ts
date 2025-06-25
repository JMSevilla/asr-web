import { NextApiHandler } from 'next';
import { CountryListResponse } from '../../../../src/api/mdp/types';
import { errorResponse } from '../../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (_, res) => {
  try {
    const result = await client.get<CountryListResponse[]>(`/mdp-api/api/addresses/countries`);
    res.status(result.status).json(result.data);
  } catch (error) {
    errorResponse(error, res);
  }
});

export default handler;
