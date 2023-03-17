import { initializeApp, FirebaseApp } from "firebase/app";
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";

const firebaseConfig: object = {
  apiKey: "AIzaSyDAG01l-qTW-YkDCaPUCkaRWl11OdgIeXk",
  authDomain: "jarves-980a1.firebaseapp.com",
  projectId: "jarves-980a1",
  storageBucket: "jarves-980a1.appspot.com",
  messagingSenderId: "701275942844",
  appId: "1:701275942844:web:7a9f5d3be900c1050885b9",
  measurementId: "G-2M07D6JEK8",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const provider: GoogleAuthProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};
