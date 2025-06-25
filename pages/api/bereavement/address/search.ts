import { NextApiHandler } from 'next';
import { Address } from '../../../../src/api/mdp/types';
import { errorResponse } from '../../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../../src/core/ssr/withSsrHttpClient';
import qs from 'query-string';

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
  try {
    const result = await client.get<Address[]>(
      `/mdp-api/api/bereavement-journeys/address/search?${qs.stringify(req.query, {
        encode: false,
        skipNull: true,
      })}`,
      req.body,
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    errorResponse(error, res);
  }
});

export default handler;
