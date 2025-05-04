// Import the necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const messaging = getMessaging(app);

// Function to generate FCM token with service worker registration
export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log("Notification permission:", permission);

  if (permission === "granted") {
    try {
      // Register service worker from public folder
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log("Service Worker registered:", registration);

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: "BKQc38HyUXuvI_yz5hPvprjVjmWrcUjTP2H7J_cjGoyMMoBGNBbC0ucVGrzM67rICMclmUuOx-mdt7CXlpnhq9g",
        serviceWorkerRegistration: registration,
      });

      console.log("FCM Token:", token);
      return token;
    } catch (err) {
      console.error("Failed to get FCM token:", err);
      return null;
    }
  } else {
    console.warn("Notification permission not granted.");
    return null;
  }
};


export {
  getToken,
  onMessage,
  app,
  auth,
  provider,
  db,
  storage,
  signInWithPopup,
  messaging
};
