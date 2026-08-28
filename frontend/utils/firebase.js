// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import App from "../src/App.jsx";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiVR9x5JR_1wd1nmCW263wjDpTJKaHmtc",
  authDomain: "streamilix-f655d.firebaseapp.com",
  projectId: "streamilix-f655d",
  storageBucket: "streamilix-f655d.firebasestorage.app",
  messagingSenderId: "900738795017",
  appId: "1:900738795017:web:8749082a1ce2716b639ad8",
  measurementId: "G-QN46GL0KKV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}