import { getContentFromHost } from './cefUtils.ts';

const defaultEditorContent = '<div style="text-align: left;"><br /></div>';

export function summernote(...args) {
  return window.$('#summernote').summernote(...args);
}

async function getInitialContent() {
  try {
    const hostContent = await getContentFromHost();

    if (hostContent) {
      return hostContent;
    }
  } catch(e) {
    console.error('Failed to retrieve content from host', e);
  }

  return getDraft() || defaultEditorContent;
}

function getDraft() {
  return localStorage.getItem('textEditorDraft');
}

function clearDraft() {
  localStorage.removeItem('textEditorDraft');
}

export function saveDraft() {
  localStorage.setItem('textEditorDraft', getEditorHTMLNode().innerHTML);
}

export function getEditorHTMLNode() {
  return document.querySelector('[contenteditable="true"]');
}

export async function onEditorInit() {
  getEditorHTMLNode().innerHTML = '';

  const initialContent = await getInitialContent();

  summernote('pasteHTML', initialContent);
}

export function clearEditor() {
  getEditorHTMLNode().innerHTML = defaultEditorContent;
  getEditorHTMLNode().focus();

  clearDraft();
}

export function showTooltip() {
  const resetButton = window.$('.reset-button');
  const tooltipAlreadyDisplayed = localStorage.getItem('hideTextEditorResetTooltip');

  resetButton.tooltip('enable');

  if (!tooltipAlreadyDisplayed) {
    setTimeout(() => {
      resetButton.tooltip('show');

      setTimeout(() => {
        resetButton.tooltip('hide');
        localStorage.setItem('hideTextEditorResetTooltip', 'true');
      }, 7000);
    }, 500); // wait for layout shifts
  }
}

export function clearError() {
  document.querySelector('.error').style.visibility = 'hidden';
}

export function showError() {
  document.querySelector('.error').style.visibility = 'visible';
}

export function adjustToolbar() {
  document.querySelectorAll('.note-codeview-keep').forEach((button) => button.style.display = 'none');
}
