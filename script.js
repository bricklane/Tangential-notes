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

const addButton = document.getElementById('add-button');
const urlInput = document.getElementById('url-input');
const pinnedBottom = document.querySelector('.pinned-bottom');

// Initial state
addButton.textContent = '+';
urlInput.style.visibility = 'hidden';
urlInput.style.opacity = '0';
addButton.disabled = false;

addButton.addEventListener('click', () => {
  if (urlInput.style.visibility === 'hidden') {
    // Empty state
    addButton.textContent = 'Add to thread';
    urlInput.style.visibility = 'visible';
    urlInput.style.opacity = '1';
    addButton.disabled = true;
  } else if (urlInput.value) {
    // Submitted state
    console.log('Success!');
    addButton.textContent = 'Added!';
    urlInput.disabled = true;
    addButton.disabled = true;

    // After 5 seconds, return to inactive state
    setTimeout(() => {
      addButton.textContent = '+';
      urlInput.style.visibility = 'hidden';
      urlInput.style.opacity = '0';
      urlInput.value = '';
      urlInput.disabled = false;
      addButton.disabled = false;
    }, 5000);
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