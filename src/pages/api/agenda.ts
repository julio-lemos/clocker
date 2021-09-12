import { addHours, differenceInHours, format } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const agendaDb = db.collection('agenda');

const startAt = new Date(2021, 1, 1, 8, 0);
const endAt = new Date(2021, 1, 1, 17, 0);
const totalHours = differenceInHours(endAt, startAt);

const timeBlocksList: string[] = [];

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
  const time = format(addHours(startAt, blockIndex), 'HH:mm');
  timeBlocksList.push(time);
}

const agenda = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401);
  }

  try {
    const { user_id } = await firebaseServer.auth().verifyIdToken(token);

    const snapshot = await agendaDb
      .where('userId', '==', user_id)
      .where('date', '==', req.query.date)
      .get();

    const docs = snapshot.docs.map(doc => doc.data());
    const result = timeBlocksList.map(time => ({
      time,
      information: docs.find(doc => doc.time === time),
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

export default agenda;
