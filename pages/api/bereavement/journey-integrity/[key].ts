import { NextApiHandler } from 'next';
import { JourneyIntegrityResponse } from '../../../../src/api/mdp/types';
import { errorResponse } from '../../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
  try {
    const { key } = req.query;
    const result = await client.get<JourneyIntegrityResponse>(
      `/mdp-api/api/bereavement-journeys/integrity/${key}`,
      req.body,
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    errorResponse(error, res);
  }
});

export default handler;
