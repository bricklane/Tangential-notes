import './scss/styles.scss';
import axios from 'axios';
console.log("Hello");
import '@material/mwc-button/mwc-button.js';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Toolbar options for Quill editor
const toolbarOptions = [
  ['bold', 'italic', 'underline'],
  ['blockquote', 'code-block'],
  // ... other toolbar options ...
];

// Initialize Quill editor
var quill = new Quill('#editor-container', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

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
const db = getFirestore(); 

// DOM elements
const addButton = document.getElementById('add-button');
const urlInput = document.getElementById('url-input');
const pinnedBottom = document.querySelector('.pinned-bottom');

// Function to fetch meta data
const fetchMetaData = async (url) => {
  try {
    const response = await axios.get(`https://us-central1-tangential-notes.cloudfunctions.net/fetchMeta?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meta data:', error);
    return null;
  }
};

function formatUrl(url, maxLength = 50) {
  // Remove http:// or https://
  let formattedUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");

  // Append '...' if the URL is longer than maxLength
  if (formattedUrl.length > maxLength) {
    formattedUrl = formattedUrl.substring(0, maxLength) + '...';
  }

  return formattedUrl;
} 

// Firestore listener
const tangentialCollection = collection(db, "tangential");

onSnapshot(tangentialCollection, (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === "added") {
      const data = change.doc.data();

      // Create new link-content-container
      const newContainer = document.createElement('div');
      newContainer.className = 'link-content-container';
      
      // Fetch meta data
      const metaData = await fetchMetaData(data.url);
      if (metaData && metaData.image) {
        
        // Create new link-meta-container
        const newMetaContainer = document.createElement('div');
        newMetaContainer.className = 'link-meta-container';

        // Create new link-meta-image
        const newMetaImage = document.createElement('div');
        newMetaImage.className = 'link-meta-image'; 

        const newImage = document.createElement('img');
        newImage.src = metaData.image;
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
        newAnchor.textContent = formatUrl(data.url); // Use the formatUrl function here
        newAnchor.id = 'link-url';

        // Create new elements for title
        const newTitle = document.createElement('h2');
        newTitle.textContent = data.title;

        // Append elements
        newMetaCopy.appendChild(newAnchor);
        newMetaCopy.appendChild(newTitle);
        newMetaContainer.appendChild(newMetaCopy);


        // Append new link-meta-container to link-content-container
        newContainer.appendChild(newMetaContainer);

        // Append new link-content-container to thread-container
        document.querySelector('.thread-container').appendChild(newContainer);
      }

                   // Create a new div for the Quill editor
                   const quillDiv = document.createElement('div');
                   newContainer.appendChild(quillDiv);
                   
                   // Initialize Quill editor
                   const quill = new Quill(quillDiv, {
                     theme: 'snow'  // or whatever theme you prefer
                   });
    }
  });
});

// Add button event listener
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

// Input event listener
urlInput.addEventListener('input', () => {
  // Filled state
  addButton.disabled = !urlInput.value;
});

// Document click event listener
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