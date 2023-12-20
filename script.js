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

// Import Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';

// Get a reference to the Firestore service
var db = firebase.firestore();

const addButton = document.getElementById('add-button');
const urlInput = document.getElementById('url-input');
const pinnedBottom = document.querySelector('.pinned-bottom');

// Initial state
addButton.textContent = '+';
urlInput.style.visibility = 'hidden';
urlInput.style.opacity = '0';
addButton.disabled = false;
f
addButton.addEventListener('click', () => {
  if (urlInput.style.visibility === 'hidden') {
    // Empty state
    addButton.textContent = 'Add to thread';
    urlInput.style.visibility = 'visible';
    urlInput.style.opacity = '1';
    addButton.disabled = true;
  } else if (urlInput.value) {
    // Submitted state
    // Save the input to Firestore
    db.collection('tangential').add({
      url: urlInput.value
    })
    .then((docRef) => {
      console.log('Success! Document written with ID: ', docRef.id);
      addButton.textContent = 'Added!';
      urlInput.disabled = true;
      addButton.disabled = true;
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });

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