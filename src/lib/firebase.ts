import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcUAGuh1SIQNmdVXrW_-u05hwtX61h_MY",
  authDomain: "prototype-c862a.firebaseapp.com",
  projectId: "prototype-c862a",
  storageBucket: "prototype-c862a.firebasestorage.app",
  messagingSenderId: "208853707383",
  appId: "1:208853707383:web:ca7940850f84d73baef472",
  measurementId: "G-QS1DFEKXGM"
};

// Initialize Firebase (Singleton pattern to prevent re-initialization during hot reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics safely (only runs on client side)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Export specific Firebase services for use across the application
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
