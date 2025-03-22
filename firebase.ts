// Import the necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


// Firebase configuration (same project)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId:import.meta.env.VITE_FIREBASE_APPID ,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Push Notification setup (FCM)
const messaging = getMessaging(app);

// Function to request push notification permission
const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_PUBLIC_KEY",
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Permission denied for notifications.");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

// Handle foreground notifications
onMessage(messaging, (payload) => {
  console.log("Message received in foreground:", payload);
  new Notification(payload.notification?.title || "Notification", {
    body: payload.notification?.body,
    icon: "/firebase-logo.png",
  });
});

export { app, auth, provider, signInWithPopup, messaging, requestNotificationPermission };
