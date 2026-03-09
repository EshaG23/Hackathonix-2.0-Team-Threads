import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// 🔥 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyA7UOk4CGaYkHq-rpG_zk2G0_v_Rd5TvlQ",
  authDomain: "jeevan-ecothon.firebaseapp.com",
  projectId: "jeevan-ecothon",
  storageBucket: "jeevan-ecothon.firebasestorage.app",
  messagingSenderId: "586001909523",
  appId: "1:586001909523:web:e47a13082b6d800f57fce6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// REGISTER
window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCred.user.getIdToken();

    localStorage.setItem("token", token);

    const res = await fetch("/create-user", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    alert("Registration successful");

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("User already registered. Please login.");
    } else {
      alert(error.message);
    }
  }
};


// LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCred.user.getIdToken();

  localStorage.setItem("token", token);
  //alert("Login Successful");

   // redirect
  window.location.href = "/report";
};
