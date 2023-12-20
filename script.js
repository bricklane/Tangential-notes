import './scss/styles.scss';

console.log("Hello");
import '@material/mwc-button/mwc-button.js';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  // ... other toolbar options ...
];

var quill = new Quill('#editor-container', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Import Firestore and necessary functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX1RaeTrWnn40xBWvlj9vCXdmIBZ1E7io",
  authDomain: "tangential-notes.firebaseapp.com",
  databaseURL: "https://tangential-notes-default-rtdb.firebaseio.com",
  projectId: "tangential-notes",
  storageBucket: "tangential-notes.appspot.com",
  messagingSenderId: "493355865655",
  appId: "1:493355865655:web:81e93ee4b8834a410691b2",
  measurementId: "G-LF8MCHG6RW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(); // Initialize Firestore

const addButton = document.getElementById('add-button');
const urlInput = document.getElementById('url-input');
const pinnedBottom = document.querySelector('.pinned-bottom');

// Initial state
addButton.textContent = '+';
urlInput.style.visibility = 'hidden';
urlInput.style.opacity = '0';
addButton.disabled = false;

addButton.addEventListener('click', async () => {
  if (urlInput.style.visibility === 'hidden') {
    // Empty state
    addButton.textContent = 'Add to thread';
    urlInput.style.visibility = 'visible';
    urlInput.style.opacity = '1';
    addButton.disabled = true;
  } else if (urlInput.value) {
    // Submitted state
    // Save the input to Firestore
    try {
      const docRef = await addDoc(collection(db, "tangential"), {
        url: urlInput.value
      });
      console.log("Document written with ID: ", docRef.id);
      addButton.textContent = 'Added!';
      urlInput.disabled = true;
      addButton.disabled = true;
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // After 5 seconds, return to inactive state
    setTimeout(() => {
      addButton.textContent = '+';
      urlInput.style.visibility = 'hidden';
      urlInput.style.opacity = '0';
      urlInput.value = '';
      urlInput.disabled = false;
      addButton.disabled = false;
    }, 2000);
  }
});

urlInput.addEventListener('input', () => {
  // Filled state
  addButton.disabled = !urlInput.value;
});

document.addEventListener('click', (event) => {
  if (!pinnedBottom.contains(event.target)) {
    // Inactive state
    addButton.textContent = '+';
    urlInput.style.visibility = 'hidden';
    urlInput.style.opacity = '0';
    urlInput.value = '';
    addButton.disabled = false;
  }
});