import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBawDYdpoJQl9SIISNYpwWy-GeiLr4PlOA",
  authDomain: "italcarcrm.firebaseapp.com",
  projectId: "italcarcrm",
  storageBucket: "italcarcrm.firebasestorage.app",
  messagingSenderId: "357539528758",
  appId: "1:357539528758:web:61187f9bc7626576615897",
  measurementId: "G-936S5P8SNM"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

export default app;
