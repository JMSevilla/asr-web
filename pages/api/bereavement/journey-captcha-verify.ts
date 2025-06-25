import { NextApiHandler } from 'next';
import { stringify } from 'query-string';
import { errorResponse } from '../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
  try {
    const result = await client.post(
      `/recaptcha/api/siteverify?${stringify({ ...req.body, secret: process.env.RECAPTCHA_SECRET })}`,
      null,
      { baseURL: 'https://www.google.com', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    errorResponse(error, res);
  }
});

export default handler;
