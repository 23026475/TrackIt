// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAfZdZy3JFupwonzn7U0hHdJeILJ8KCLA",
  authDomain: "trackit-4a9ee.firebaseapp.com",
  projectId: "trackit-4a9ee",
  storageBucket: "trackit-4a9ee.firebasestorage.app",
  messagingSenderId: "621816876601",
  appId: "1:621816876601:web:98702076a2953b3f9987e8",
  measurementId: "G-PE3K41Y38X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);