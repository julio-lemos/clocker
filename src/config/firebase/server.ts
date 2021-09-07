import firebaseServer from 'firebase-admin';

const app = firebaseServer.apps.length
  ? firebaseServer.app()
  : firebaseServer.initializeApp({
      credential: firebaseServer.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

export { firebaseServer };
