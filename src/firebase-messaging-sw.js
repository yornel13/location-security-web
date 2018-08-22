// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
importScripts('/__/firebase/init.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyAzFM4z3GoUE3pFiwpcUBSMm-6PxMNxxaQ",
    authDomain: "icsseseguridad-6f751.firebaseapp.com",
    databaseURL: "https://icsseseguridad-6f751.firebaseio.com",
    projectId: "icsseseguridad-6f751",
    storageBucket: "icsseseguridad-6f751.appspot.com",
    messagingSenderId: "962881875237"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging();
