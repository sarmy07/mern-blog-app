// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-5cdcb.firebaseapp.com",
  projectId: "mern-blog-5cdcb",
  storageBucket: "mern-blog-5cdcb.appspot.com",
  messagingSenderId: "615399477474",
  appId: "1:615399477474:web:c33068a4c5858f44a2cebb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
