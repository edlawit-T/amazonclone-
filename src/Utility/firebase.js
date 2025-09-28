import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuICsxzzyve6K9t0KBSDxL6D2EDCATA8o",
  authDomain: "clone-13dae.firebaseapp.com",
  projectId: "clone-13dae",
  storageBucket: "clone-13dae.appspot.com",
  messagingSenderId: "268979005967",
  appId: "1:268979005967:web:5fee216c4060ffb076d17a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
