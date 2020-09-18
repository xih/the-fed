import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD6chYa7YxajP57R6nFOpPoasrISjpVhw8",
  authDomain: "flames-4cfe9.firebaseapp.com",
  databaseURL: "https://flames-4cfe9.firebaseio.com",
  projectId: "flames-4cfe9",
  storageBucket: "flames-4cfe9.appspot.com",
  messagingSenderId: "3968717937",
  appId: "1:3968717937:web:e6696982629aa8054a77d0",
  measurementId: "G-03RQM1LXZE",
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()
