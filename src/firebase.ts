import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
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

// Connect to named firestore database with auto-detect long polling for reliable connectivity in iframe/proxy environments
let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
    },
    configJson.firestoreDatabaseId || undefined
  );
} catch {
  firestoreDb = configJson.firestoreDatabaseId 
    ? getFirestore(app, configJson.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreDb;

export const auth = getAuth(app);

// Initial connectivity validation as per Firebase Integration Skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client operating in offline mode or connecting...');
    }
  }
}
testConnection();

export default app;
