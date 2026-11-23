import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyABj4Zu8GJKoF4zctJjrrtCBQy1s7k81BI",

  authDomain: "myproject-9ff17.firebaseapp.com",

  projectId: "myproject-9ff17",

  storageBucket: "myproject-9ff17.firebasestorage.app",

  messagingSenderId: "517838793086",

  appId: "1:517838793086:web:2ce86c5308c0880bdd2b2f"

};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);