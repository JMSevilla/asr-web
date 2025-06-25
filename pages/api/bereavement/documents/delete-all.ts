import { NextApiHandler } from 'next';
import { errorResponse } from '../../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
  try {
    const result = await client.put(`/mdp-api/api/journeys/documents/delete/all`, req.body);
    res.status(result.status).json(result.data);
  } catch (error) {
    errorResponse(error, res);
  }
});

export default handler;
