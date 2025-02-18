import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Analytics
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;