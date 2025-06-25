import { NextApiHandler } from 'next';
import { FileUploadResponse } from '../../../../src/api/mdp/types';
import { reqBodyToFormData } from '../../../../src/core/ssr/form-data';
import { errorResponse } from '../../../../src/core/ssr/responses';
import { withSsrHttpClient } from '../../../../src/core/ssr/withSsrHttpClient';

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
  try {
    const formData = await reqBodyToFormData(req);
    const result = await client.post<FileUploadResponse>(`/mdp-api/api/journeys/documents/tags/update`, formData, {
      headers: formData.getHeaders(),
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    errorResponse(error, res);
  }
});

export const config = { api: { bodyParser: false } };

export default handler;
