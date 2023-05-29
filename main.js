import DOMPurify from 'isomorphic-dompurify';
import {
  summernote,
  saveDraft,
  onEditorInit,
  getEditorHTMLNode,
  clearEditor,
  clearError,
  showError,
  showTooltip,
  adjustToolbar,
} from './editorUtils.js';
import { initializeCef, sendContentToHost } from './cefUtils.ts';

async function initializeApp() {
  try {
    await initializeCef();
  } catch(e) {
    console.info('Cef not initialized. Running in isolation from host');
    console.error(e);
  }

  summernote({
    focus: true,
    dialogsFade: true,
    dialogsInBody: true,
    disableResizeEditor: true,
    callbacks: {
      onInit: onEditorInit,
      onChange: clearError,
    }
  });

  adjustToolbar();
}

// Reinitialize app in case of unexpected behaviour
async function reinitializeApp() {
  clearEditor();

  await initializeApp();

  // The editor won't call `onInit` if already initialized
  onEditorInit();
}

async function handleSubmit(ev) {
  ev.preventDefault();

  const content = getEditorHTMLNode().innerHTML;

  if (content) {
    const sanitizedContent = DOMPurify.sanitize(content);

    try {
      await sendContentToHost(sanitizedContent);
      clearEditor();
    } catch(e) {
      console.error('Failed to send content to host.', e);
      showError();
    }
  }
}

function hydrate() {
  document.querySelector('form').addEventListener('submit', handleSubmit);
  document.querySelector('.reset-button').addEventListener('click', reinitializeApp);

  window.addEventListener('beforeunload', saveDraft);
}

window.$(async() => {
  await initializeApp();

  summernote('fullscreen.toggle');
  showTooltip();
  hydrate();

  // Avoid initialization flicker
  document.querySelector('form').style.visibility = 'visible';
});
