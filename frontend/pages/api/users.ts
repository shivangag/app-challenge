// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { users } from  '../../user/userList';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(users)
}
