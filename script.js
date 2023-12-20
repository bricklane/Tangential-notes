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
    }, 2000);

    const blob = new Blob([JSON.stringify({ text: urlInput.value })], { type: 'application/json' });

    // Create a URL representing the Blob object
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'input.json';

    // Append the link element to the body
    document.body.appendChild(link);

    // Programmatically click the link element to download the file
    link.click();

    // Remove the link element from the body
    document.body.removeChild(link);    
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