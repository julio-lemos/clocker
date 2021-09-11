import { NextApiRequest, NextApiResponse } from 'next';

const agenda = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query);
  res.status(200).json({ name: 'John Doe' });
};

export default agenda;
