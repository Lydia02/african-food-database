import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';

dotenv.config();

let db;
let bucket;

const readEnv = (key) => {
  const value = process.env[key];
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const initializeFirebase = () => {
  if (admin.apps.length > 0) {
    db = admin.firestore();
    bucket = admin.storage().bucket();
    return { db, bucket };
  }

  const serviceAccountPath = readEnv('FIREBASE_SERVICE_ACCOUNT_PATH');
  const serviceAccountJson = readEnv('FIREBASE_SERVICE_ACCOUNT_JSON');

  const plainServiceAccount = {
    type: readEnv('type'),
    project_id: readEnv('project_id') || readEnv('FIREBASE_PROJECT_ID'),
    private_key_id: readEnv('private_key_id'),
    private_key: readEnv('private_key'),
    client_email: readEnv('client_email'),
    client_id: readEnv('client_id'),
    auth_uri: readEnv('auth_uri'),
    token_uri: readEnv('token_uri'),
    auth_provider_x509_cert_url: readEnv('auth_provider_x509_cert_url'),
    client_x509_cert_url: readEnv('client_x509_cert_url'),
    universe_domain: readEnv('universe_domain'),
  };

  try {
    if (serviceAccountJson) {
      try {
        const serviceAccount = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: readEnv('FIREBASE_STORAGE_BUCKET') || `${serviceAccount.project_id}.appspot.com`,
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
        storageBucket: readEnv('FIREBASE_STORAGE_BUCKET') || `${readEnv('FIREBASE_PROJECT_ID')}.appspot.com`,
      });
      console.log('✅ Firebase initialized with service account file');
    }

    if (
      admin.apps.length === 0
      && readEnv('FIREBASE_CLIENT_EMAIL')
      && readEnv('FIREBASE_PRIVATE_KEY')
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: readEnv('FIREBASE_PROJECT_ID'),
          clientEmail: readEnv('FIREBASE_CLIENT_EMAIL'),
          privateKey: readEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        }),
        storageBucket: readEnv('FIREBASE_STORAGE_BUCKET') || `${readEnv('FIREBASE_PROJECT_ID')}.appspot.com`,
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
        storageBucket: readEnv('FIREBASE_STORAGE_BUCKET') || `${plainServiceAccount.project_id}.appspot.com`,
      });
      console.log('✅ Firebase initialized with plain service-account environment variables');
    }

    if (admin.apps.length === 0) {
      // For development/testing — initialize with project ID only (uses ADC)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'african-food-database',
        storageBucket: readEnv('FIREBASE_STORAGE_BUCKET') || 'african-food-database.appspot.com',
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
