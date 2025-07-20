// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD22bUNGqPPFdGB2YzCVzg4Fybvmrch_Dw",
  authDomain: "fraijob-d2e9b.firebaseapp.com",
  projectId: "fraijob-d2e9b",
  storageBucket: "fraijob-d2e9b.appspot.com",
  messagingSenderId: "572438181927",
  appId: "1:572438181927:web:4495df78dfee3bb7d87602",
  measurementId: "G-814TFDTEQ5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };
