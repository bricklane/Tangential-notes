import './scss/styles.scss';

console.log("Hello");
import '@material/mwc-button/mwc-button.js';

import Quill from 'quill';

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
