// Import the necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


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
export const messaging = getMessaging(app);

// Authentication setup
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
      const token = await getToken(messaging, {
          vapidKey: "BKQc38HyUXuvI_yz5hPvprjVjmWrcUjTP2H7J_cjGoyMMoBGNBbC0ucVGrzM67rICMclmUuOx-mdt7CXlpnhq9g",
      })
      console.log(token)
      return token;
  }
  else
      return null

}


export { getToken, onMessage, app, auth, provider, db, storage, signInWithPopup };
