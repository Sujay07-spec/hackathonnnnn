// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzV8-WHGFhV9iayvO4-utaNfFCGrw4ULc",
  authDomain: "management-system-755b8.firebaseapp.com",
  projectId: "management-system-755b8",
  storageBucket: "management-system-755b8.firebasestorage.app",
  messagingSenderId: "763895925828",
  appId: "1:763895925828:web:8e8c3d1a3371246af34011",
  measurementId: "G-WS68C437ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
</parameter>