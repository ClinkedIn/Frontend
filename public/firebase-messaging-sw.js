// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyA5j2m6iqXzQu7hOxeCHSdxKIGwLMmH7Gc",
  authDomain: "lockedin-7908a.firebaseapp.com",
  projectId: "lockedin-7908a",
  storageBucket: "lockedin-7908a.firebasestorage.app",
  messagingSenderId: "358685157127",
  appId: "1:358685157127:web:c7200f0f929de131c007a2",
  measurementId: "G-MYYPLVYZ3L"
};

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);

    const [title, date, time] = payload.notification.title.split(' --- ');
    
    // Generate a unique key using the current date-time to ensure uniqueness
    const uniqueKey = `${date.trim()}-${time.trim()}-${new Date().getTime()}`;

    const notificationDetails = {
        key: uniqueKey,
        title: title.trim(),
        date: date.trim(),
        time: time.trim(),
        description: payload.notification.body,
        image: avatar
    };
    addNotification(notificationDetails);

});