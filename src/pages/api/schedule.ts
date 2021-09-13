import { addHours, differenceInHours, format } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();

const profileDb = db.collection('profiles');
const agendaDb = db.collection('agenda');

const startAt = new Date(2021, 1, 1, 8, 0);
const endAt = new Date(2021, 1, 1, 17, 0);
const totalHours = differenceInHours(endAt, startAt);

const timeBlocksList: string[] = [];

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
  const time = format(addHours(startAt, blockIndex), 'HH:mm');
  timeBlocksList.push(time);
}

const getUserId = async (username: string) => {
  const profileDoc = await profileDb.where('username', '==', username).get();

  if (!profileDoc.docs.length) {
    return false;
  }

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
    const userId = await getUserId(req.query.username as string);

    if (!userId) {
      return res.status(404).json({ message: 'Invalid username' });
    }

    const snapshot = await agendaDb
      .where('userId', '==', userId)
      .where('date', '==', req.query.date)
      .get();

    const docs = snapshot.docs.map(doc => doc.data());
    const result = timeBlocksList.map(time => ({
      time,
      isBlocked: Boolean(docs.find(doc => doc.time === time)),
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.log(`Error: ${err}`);
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
