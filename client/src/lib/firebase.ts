import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFg3GmvamicTe6dYuvnZQ1Q2b--cn8DVI",
  authDomain: "accelerateaifb.firebaseapp.com",
  projectId: "accelerateaifb",
  storageBucket: "accelerateaifb.firebasestorage.app",
  messagingSenderId: "958357675419",
  appId: "1:958357675419:web:8d9d88cc7695a48c03153e",
  measurementId: "G-M9PYLEWLVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set auth persistence to local
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, analytics };
export default app;