import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import configJson from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: configJson.apiKey,
  authDomain: configJson.authDomain,
  projectId: configJson.projectId,
  storageBucket: configJson.storageBucket,
  messagingSenderId: configJson.messagingSenderId,
  appId: configJson.appId,
  measurementId: configJson.measurementId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Connect strictly to the app's provisioned Firestore database instance
export const db = getFirestore(app, configJson.firestoreDatabaseId);

export const auth = getAuth(app);

export default app;
