import './scss/styles.scss';
import axios from 'axios';
console.log("Hello");
import '@material/mwc-button/mwc-button.js';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline'],
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
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore"; // Import Firestore and necessary functions

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

// Firestore listener
const tangentialCollection = collection(db, "tangential");

onSnapshot(tangentialCollection, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const data = change.doc.data();

      // Create new link-content-container
      const newContainer = document.createElement('div');
      newContainer.className = 'link-content-container';

      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = encodeURIComponent(data.url);

      axios.get(proxyUrl + targetUrl)
        .then(response => {
          const newTitle = document.getElementById('link-meta-title');
          newTitle.textContent = response.data.title; // Set the title text content
        })
        .catch(error => console.error('Error:', error));

      // Create new link-meta-container
      const newMetaContainer = document.createElement('div');
      newMetaContainer.className = 'link-meta-container';

      // Create new link-meta-image
      const newMetaImage = document.createElement('div');
      newMetaImage.className = 'link-meta-image';

      const newImage = document.createElement('img');
      newImage.src = data.image;
      newImage.alt = data.title;

      // Append image to link-meta-image
      newMetaImage.appendChild(newImage);

      // Append link-meta-image to link-meta-container
      newMetaContainer.appendChild(newMetaImage);

      // Create new link-meta-copy
      const newMetaCopy = document.createElement('div');
      newMetaCopy.className = 'link-meta-copy';

      // Create new anchor element for URL
      const newAnchor = document.createElement('a');
      newAnchor.className = 'body-medium';
      newAnchor.href = data.url;
      newAnchor.textContent = data.url;
      newAnchor.id = 'link-url';

      // Create new elements for title
      const newTitle = document.createElement('h2');
      newTitle.textContent = data.title;

      // Append elements
      newMetaCopy.appendChild(newAnchor);
      newMetaCopy.appendChild(newTitle);
      newMetaContainer.appendChild(newMetaCopy);
      newContainer.appendChild(newMetaContainer);

      // Append new link-content-container to thread-container
      document.querySelector('.thread-container').appendChild(newContainer);
    }
  });
});

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