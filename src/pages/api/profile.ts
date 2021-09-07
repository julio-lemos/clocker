import { NextApiRequest, NextApiResponse } from 'next';

import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const profileDb = db.collection('profiles');

const profile = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  const { user_id } = await firebaseServer
    .auth()
    .verifyIdToken(token as string);

  profileDb.doc(req.body.username).set({
    userId: user_id,
    username: req.body.username,
  });
};

export default profile;
