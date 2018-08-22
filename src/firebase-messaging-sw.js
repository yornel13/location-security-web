// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
importScripts('/__/firebase/init.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: 'AIzaSyAo1TwJI_rVFArz9GO4QdFsKy5NVpZDRNA',
  authDomain: 'testchat-54a32.firebaseapp.com',
  databaseURL: 'https://testchat-54a32.firebaseio.com/',
  projectId: 'testchat-54a32',
  storageBucket: 'testchat-54a32.appspot.com',
  messagingSenderId: '976182334043'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging();
