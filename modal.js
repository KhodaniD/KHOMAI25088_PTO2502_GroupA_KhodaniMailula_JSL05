/**
 * modal.js
 * Handles modal creation, display, and interaction for adding/editing tasks.
 * This module is responsible for generating the modal HTML, populating its fields,
 * and managing its submission and closure logic.
 */

import { addNewTask, updateTaskState, deleteTask } from './tasks.js';

// Global references to modal elements for consistent access
let modalBackdrop = null;
let modal = null;
let closeButton = null;
let modalTitle = null;

// References for the title input group
let titleFieldGroup = null; // The div wrapper that holds label, input, and validation
let titleLabel = null;
let titleInput = null;
let titleValidationMessageSpan = null; // The validation message span itself

let descriptionTextarea = null;
let statusSelect = null;
let primaryButton = null;
let deleteButton = null; // Reference for the delete button (only for edit mode)

/**
 * Stores the ID of the task currently being edited.
 * Null if adding a new task.
 * @type {number|null}
 */
let currentTaskId = null;

// New helper function to manage title validation state
/**
 * Updates the visibility of the custom title validation message and the browser's custom validity.
 * Ensures that the validation message appears when the field is empty and disappears when content is present.
 * Also applies the red border to the input when invalid.
 * @param {boolean} isValid - True if the title field content is considered valid (e.g., not empty), false otherwise.
 */
function updateTitleValidation(isValid) {
    if (!titleFieldGroup || !titleInput) return; // Defensive check

    if (isValid) {
        // If content is valid (or should be hidden)
        titleFieldGroup.classList.remove('show-validation');
        titleInput.setCustomValidity('');
        console.log('[Validation State] Hiding message, clearing browser validity.');
    } else {
        // If content is invalid (empty)
        titleFieldGroup.classList.add('show-validation');
        titleInput.setCustomValidity('Please fill out this field.');
        console.log('[Validation State] Showing message, setting browser validity.');
    }
}

/**
 * Creates and appends the necessary modal DOM elements to the document body.
 * This function should be called only once (from main.js) to set up the basic modal structure.
 * Subsequent calls to `openTaskModal` will reuse and update these elements.
 * @returns {void}
 */
export function createModalElements() {
    modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.id = 'taskModalBackdrop';
    modalBackdrop.style.display = 'none';

    modal = document.createElement('div');
    modal.className = 'modal';

    closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        modalBackdrop.style.display = 'none';
        updateTitleValidation(true); // Reset validation state when closing with 'x'
    });

    modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Task Details';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    titleFieldGroup = document.createElement('div');
    titleFieldGroup.className = 'form-group';

    titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title';
    titleLabel.setAttribute('for', 'modalTaskTitle');

    titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'modalTaskTitle';
    titleInput.placeholder = 'e.g. Take chilled break';

    titleValidationMessageSpan = document.createElement('span');
    titleValidationMessageSpan.className = 'validation-message';

    const exclamationSpan = document.createElement('span');
    exclamationSpan.className = 'exclamation-mark';
    exclamationSpan.textContent = '!';

    const messageTextSpan = document.createElement('span');
    messageTextSpan.textContent = ' Please fill out this field.';

    titleValidationMessageSpan.appendChild(exclamationSpan);
    titleValidationMessageSpan.appendChild(messageTextSpan);

    titleFieldGroup.appendChild(titleLabel);
    titleFieldGroup.appendChild(titleInput);
    titleFieldGroup.appendChild(titleValidationMessageSpan);

}
