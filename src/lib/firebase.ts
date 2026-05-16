import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBHa2hFY8XB4HzpZCfRth11rf6LwHeimbw",
  authDomain: "portfolioweb-96318.firebaseapp.com",
  projectId: "portfolioweb-96318",
  storageBucket: "portfolioweb-96318.firebasestorage.app",
  messagingSenderId: "303917098988",
  appId: "1:303917098988:web:4e163bc0e4c7992dc0c2c9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
