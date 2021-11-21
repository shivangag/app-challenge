// Import the functions you need from the SDKs you nee
import firebase from "firebase/app"
import "firebase/analytics"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig

if (process.env.NODE_ENV === "production") {
  // -- production project
  firebaseConfig = {
    apiKey: "AIzaSyANZ5g3Xsv7zZRbfWwLKBn2hz9vDQLMUns",
    authDomain: "app-challenge-bd473.firebaseapp.com",
    projectId: "app-challenge-bd473",
    storageBucket: "app-challenge-bd473.appspot.com",
    messagingSenderId: "284829939378",
    appId: "1:284829939378:web:9d0021f267cd77fc987bab",
    measurementId: "G-KR96PMH51Z",
  }
} else {
  // -- staging project
  firebaseConfig = {
    apiKey: "AIzaSyCcTaMpYdF9f8UqX5Y8wgalIr3r8PtXmD4",
    authDomain: "app-staging-challenge.firebaseapp.com",
    projectId: "app-staging-challenge",
    storageBucket: "app-staging-challenge.appspot.com",
    messagingSenderId: "806418029869",
    appId: "1:806418029869:web:a6d7e70fdc596a195e47a4",
    measurementId: "G-6WR8L7DED4",
  }
}

// Initialize Firebase

if (typeof window !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  if ("measurementId" in firebaseConfig) firebase.analytics()
}

export default firebase
