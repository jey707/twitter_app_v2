import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYkWT55iEWQ0JhHXQM-PJnvArXg_WKhLE",
  authDomain: "tweet-v2.firebaseapp.com",
  projectId: "tweet-v2",
  storageBucket: "tweet-v2.appspot.com",
  messagingSenderId: "28745406681",
  appId: "1:28745406681:web:99da388e0037b6f88b86c8",
};

const app = initializeApp(firebaseConfig);

export const firebaseInstance = firebaseConfig;

export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage();
export default app;
