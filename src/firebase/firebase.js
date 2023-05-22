import firebase from "firebase/app";

const config = {
  apiKey: "AIzaSyBHvzN0UNjKshKiu3CG-f0B6eDkOmjNUps",
  authDomain: "aims-blob.firebaseapp.com",
  projectId: "aims-blob",
  storageBucket: "aims-blob.appspot.com",
  messagingSenderId: "860100368551",
  appId: "1:860100368551:web:68d8883eb5ac96c29ce382",
};

// Initialize Firebase
  firebase.initializeApp(config);

  export default firebase;

