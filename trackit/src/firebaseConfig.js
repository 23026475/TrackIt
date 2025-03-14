import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { ref } from "vue"; // Don't forget to import 'ref' for reactivity

// Firebase Configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Reactive variable for the user state
const user = ref(null);

// Set up onAuthStateChanged listener to handle user authentication state
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

export { db, auth, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs };

