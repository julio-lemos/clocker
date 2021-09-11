import { addHours, differenceInHours, format } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const profileDb = db.collection('profile');
const agendaDb = db.collection('agenda');

const startAt = new Date(2021, 1, 1, 8, 0);
const endAt = new Date(2021, 1, 1, 17, 0);
const totalHours = differenceInHours(endAt, startAt);

const timeBlocks: string[] = [];

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
  const time = format(addHours(startAt, blockIndex), 'HH:mm');
  timeBlocks.push(time);
}

console.log(timeBlocks);

const schedule = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const profileDoc = await profileDb
    //   .where('username', '==', req.query.username)
    //   .get();

    // const snashot = await agendaDb
    //   .where('userId', '==', profileDoc.userId)
    //   .where('when', '==', req.query.when)
    //   .get();

    return res.status(200).json(timeBlocks);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

export default schedule;
