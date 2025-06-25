import { NextApiHandler } from 'next';
import { EmailToken } from '../../../src/api/mdp/types';
import { errorResponse } from '../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
  try {
    const result = await client.post<EmailToken>(`/mdp-api/api/bereavement/contacts/confirmation/email/send`, req.body);
    res.status(result.status).json(result.data);
  } catch (error) {
    errorResponse(error, res);
  }
});

export default handler;
