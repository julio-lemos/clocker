import { addHours, differenceInHours, format } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const profileDb = db.collection('profiles');
const agendaDb = db.collection('agenda');

const startAt = new Date(2021, 1, 1, 8, 0);
const endAt = new Date(2021, 1, 1, 17, 0);
const totalHours = differenceInHours(endAt, startAt);

const timeBlocks: string[] = [];

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
  const time = format(addHours(startAt, blockIndex), 'HH:mm');
  timeBlocks.push(time);
}

const getUserId = async (username: string) => {
  const profileDoc = await profileDb.where('username', '==', username).get();

  const { userId } = profileDoc.docs[0].data();

  return userId;
};

const setSchedule = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = await getUserId(req.body.username);
  const docId = `${userId}#${req.body.date}#${req.body.time}`;

  const doc = await agendaDb.doc(docId).get();

  if (doc.exists) {
    res.status(400).json({ error: 'Time blocked!' });
    return;
  }

  const block = await agendaDb.doc(docId).set({
    userId,
    date: req.body.date,
    time: req.body.time,
    name: req.body.name,
    phone: req.body.phone,
  });

  return res.status(200).json(block);
};

const getSchedule = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const profileDoc = await profileDb
    //   .where('username', '==', req.query.username)
    //   .get();

    // const snapshot = await agendaDb
    //   .where('userId', '==', profileDoc.userId)
    //   .where('when', '==', req.query.when)
    //   .get();

    return res.status(200).json(timeBlocks);
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.status(401);
  }
};

const methods: any = {
  POST: setSchedule,
  GET: getSchedule,
};

const schedule = async (req: NextApiRequest, res: NextApiResponse) =>
  methods[req.method as string]
    ? methods[req.method as string](req, res)
    : res.status(405);

export default schedule;
