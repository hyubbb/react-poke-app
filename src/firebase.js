// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1KUQJJROam58v6w-_znp-yTI-qab-ky8",
  authDomain: "react-poke-app-cdf6f.firebaseapp.com",
  // authDomain: "pokeapp-hyub.netlify.app",
  projectId: "react-poke-app-cdf6f",
  storageBucket: "react-poke-app-cdf6f.appspot.com",
  messagingSenderId: "835728498847",
  appId: "1:835728498847:web:49ef8e848591ff996ac2aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
