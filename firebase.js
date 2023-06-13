// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/learn#add-sdks-initialize

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARZxwmk4IEF6c7f0Sk7XHU8EmjFb2DkUg",
  authDomain: "arsenal-challenge.firebaseapp.com",
  projectId: "arsenal-challenge",
  storageBucket: "arsenal-challenge.appspot.com",
  messagingSenderId: "532114080761",
  appId: "1:532114080761:web:6ec735b787e6282fecb328",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("testing");
} else {
  app = getApp();
  console.log("testing2");
}

const auth = getAuth(app);
const db = getFirestore();

export { auth, db };
