import firebase from 'firebase';

const FirebaseApp = firebase.initializeApp({
     apiKey: "AIzaSyAmaJ_AiQ4mLhV0rWuuG9mvy0d8hUSGC4A",
  authDomain: "socialapp-react-862b7.firebaseapp.com",
  databaseURL: "https://socialapp-react-862b7-default-rtdb.firebaseio.com",
  projectId: "socialapp-react-862b7",
  storageBucket: "socialapp-react-862b7.appspot.com",
  messagingSenderId: "650970463816",
  appId: "1:650970463816:web:d3ec6a30b3b7ed5633227d",
  measurementId: "G-NET3KQVQGH"
});

const db = FirebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };