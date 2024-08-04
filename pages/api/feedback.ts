import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Compra realizada');

  console.log('Request body: ', req.body);
  console.log('Request method: ', req.method);

  res.redirect('/compra-realizada');
}
