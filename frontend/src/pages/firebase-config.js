// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBu5nVy1g7ZAgpXx6UVgnCFkx2PIi3evl8",
    authDomain: "educator-6a877.firebaseapp.com",
    projectId: "educator-6a877",
    storageBucket: "educator-6a877.firebasestorage.app",
    messagingSenderId: "809285895927",
    appId: "1:809285895927:web:389911ea633b85648d75f2",
    measurementId: "G-QVSTVNZJJQ"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
