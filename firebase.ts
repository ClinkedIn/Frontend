// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth,signInWithPopup,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5j2m6iqXzQu7hOxeCHSdxKIGwLMmH7Gc",
  authDomain: "lockedin-7908a.firebaseapp.com",
  projectId: "lockedin-7908a",
  storageBucket: "lockedin-7908a.firebasestorage.app",
  messagingSenderId: "358685157127",
  appId: "1:358685157127:web:c7200f0f929de131c007a2",
  measurementId: "G-MYYPLVYZ3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider,signInWithPopup};