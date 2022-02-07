import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzlmXEiTJDJ4cLPOGKHfaHW_WtyNBl6OQ",
  authDomain: "vinted-auto-messager.firebaseapp.com",
  projectId: "vinted-auto-messager",
  storageBucket: "vinted-auto-messager.appspot.com",
  messagingSenderId: "877430497962",
  appId: "1:877430497962:web:776926415cc1e3114a26d3",
  measurementId: "G-K4HZ5HEPPN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
