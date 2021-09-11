import { NextApiRequest, NextApiResponse } from 'next';

import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const agendaDb = db.collection('agenda');

const agenda = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401);
  }

  try {
    const { user_id } = await firebaseServer.auth().verifyIdToken(token);
    const snashot = await agendaDb
      .where('userId', '==', user_id)
      .where('when', '==', req.query.when)
      .get();

    return res.status(200).json(snashot.docs);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

export default agenda;
