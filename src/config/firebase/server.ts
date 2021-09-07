import firebaseServer from 'firebase-admin';
import { firebaseClient } from './client';

const app = firebaseClient.apps.length
  ? firebaseClient.app()
  : firebaseClient.initializeApp({
      credential: firebaseServer.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

export { firebaseServer };
