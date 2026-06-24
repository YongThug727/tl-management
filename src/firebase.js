import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6TfMmeIbalNqUCsZ30arEgRYHL91rca8",
  authDomain: "tableliftmanagement.firebaseapp.com",
  projectId: "tableliftmanagement",
  storageBucket: "tableliftmanagement.firebasestorage.app",
  messagingSenderId: "60214571692",
  appId: "1:60214571692:web:74abb8f96e97900718a509",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
