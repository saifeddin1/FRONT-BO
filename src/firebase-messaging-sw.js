importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js');


firebase.initializeApp({
    messagingSenderId: "314162988722"
});

const message = firebase.messaging();