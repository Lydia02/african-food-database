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

  const plainServiceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
  };

  try {
    if (serviceAccountJson) {
      try {
        const serviceAccount = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
        });
        console.log('✅ Firebase initialized with service account JSON env var');
      } catch (jsonErr) {
        console.warn(`⚠️ Invalid FIREBASE_SERVICE_ACCOUNT_JSON (${jsonErr.message}) — trying fallback credentials`);
      }
    }

    if (admin.apps.length === 0 && serviceAccountPath && existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
      console.log('✅ Firebase initialized with service account file');
    }

    if (
      admin.apps.length === 0
      && process.env.FIREBASE_CLIENT_EMAIL
      && process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
      console.log('✅ Firebase initialized with environment variables');
    }

    if (
      admin.apps.length === 0
      && plainServiceAccount.client_email
      && plainServiceAccount.private_key
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          ...plainServiceAccount,
          private_key: plainServiceAccount.private_key.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${plainServiceAccount.project_id}.appspot.com`,
      });
      console.log('✅ Firebase initialized with plain service-account environment variables');
    }

    if (admin.apps.length === 0) {
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
