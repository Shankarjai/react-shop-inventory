// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5EWgDNp0sM1_-a50-HqksEUpBtkytHMc",
  authDomain: "react-shop-inventory.firebaseapp.com",
  projectId: "react-shop-inventory",
  storageBucket: "react-shop-inventory.appspot.com",
  messagingSenderId: "192882103768",
  appId: "1:192882103768:web:a7cf2ef0d8099979d54ead"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app)

export {db, storage};