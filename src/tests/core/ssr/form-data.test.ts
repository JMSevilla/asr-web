import { jest } from '@jest/globals';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest } from 'next';
import { reqBodyToFormData } from '../../../core/ssr/form-data';

jest.mock('fs');
jest.mock('formidable', () => jest.fn());

describe('reqBodyToFormData', () => {
  const mockReq: NextApiRequest = {} as NextApiRequest;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should convert request body to FormData', async () => {
    (formidable as any as jest.Mock).mockImplementation(() => ({
      parse: jest.fn((_req, callback: any) => {
        const fields = { key1: 'value1', key2: '["value2", "value3"]' };
        const files = { fileKey: { filepath: '/path/to/file' } };
        callback(null, fields, files);
      }),
    }));

    (fs.createReadStream as jest.Mock).mockReturnValueOnce('mockReadableStream');

    const formData = await reqBodyToFormData(mockReq);
    expect(formidable).toHaveBeenCalledTimes(1);
    expect(formidable).toHaveBeenCalledWith({});
    expect(formData).toBeInstanceOf(FormData);
  });

  it('should handle parsing error', async () => {
    const err = new Error('Parsing error');
    (formidable as any as jest.Mock).mockImplementation(() => ({
      parse: jest.fn((_req, callback: any) => callback(err)),
    }));

    await expect(reqBodyToFormData(mockReq)).rejects.toStrictEqual({ err });
  });
});
