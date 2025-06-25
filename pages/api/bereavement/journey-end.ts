import { NextApiHandler } from 'next';
import { errorResponse } from '../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(() => async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ success: true });
  } catch (error) {
    errorResponse(error, res);
  }
});

export default handler;
