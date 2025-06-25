import { NextApiHandler } from 'next';

const handler: NextApiHandler = (_, res) => {
  res.status(200).json({ status: 'ok' });
};

export default handler;
