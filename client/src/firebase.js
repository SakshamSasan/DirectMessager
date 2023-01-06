// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAnCLchKW2B9uCFRgZHsIDu964VMhK30P4",
  authDomain: "chitchat-2a95a.firebaseapp.com",
  projectId: "chitchat-2a95a",
  storageBucket: "chitchat-2a95a.appspot.com",
  messagingSenderId: "138930211897",
  appId: "1:138930211897:web:5b985521daa17ec0c411e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app,'gs://chitchat-2a95a.appspot.com')
export default storage