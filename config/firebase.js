import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';

dotenv.config();

let db;
let bucket;

const initializeFirebase = () => {
  if (admin.apps.length > 0) {
    db = admin.firestore();
    bucket = admin.storage().bucket();
    return { db, bucket };
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  try {
    if (serviceAccountJson) {
      // Cloud deployment: service account passed as JSON env var
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
      });
      console.log('✅ Firebase initialized with service account JSON env var');
    } else if (serviceAccountPath && existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
      console.log('✅ Firebase initialized with service account file');
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
      console.log('✅ Firebase initialized with environment variables');
    } else {
      // For development/testing — initialize with project ID only (uses ADC)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'african-food-database',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'african-food-database.appspot.com',
      });
      console.log('⚠️  Firebase initialized with default credentials (limited access)');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }

  db = admin.firestore();
  bucket = admin.storage().bucket();

  // Firestore settings
  db.settings({ ignoreUndefinedProperties: true });

  return { db, bucket };
};

initializeFirebase();

export { admin, db, bucket };
export default { admin, db, bucket };
