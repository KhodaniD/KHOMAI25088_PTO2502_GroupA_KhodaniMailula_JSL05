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

    // Event Listeners for Title Input Validation
    titleInput.addEventListener('input', () => {
        console.log(`[Input] Value: '${titleInput.value.trim()}'`);
        updateTitleValidation(titleInput.value.trim() !== ''); // Hide if not empty, show if empty
    });

    titleInput.addEventListener('focus', () => {
        console.log(`[Focus] Value: '${titleInput.value.trim()}'`);
        updateTitleValidation(titleInput.value.trim() !== ''); // Show if empty on focus
    });

    titleInput.addEventListener('blur', () => {
        console.log(`[Blur] Value: '${titleInput.value.trim()}'`);
        updateTitleValidation(titleInput.value.trim() !== ''); // Show if empty on blur
    });


    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Description';
    descriptionLabel.setAttribute('for', 'modalTaskDescription');
    descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.id = 'modalTaskDescription';
    descriptionTextarea.placeholder = 'e.g. Pet your dog, have a cup of coffee, dance to your favourite song and come back to crush this challenge.';
    descriptionTextarea.rows = 4;

    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'Status';
    statusLabel.setAttribute('for', 'modalTaskStatus');
    statusSelect = document.createElement('select');
    statusSelect.id = 'modalTaskStatus';

    const statuses = ['todo', 'doing', 'done'];
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusSelect.appendChild(option);
    });

   const actionButtonsDiv = document.createElement('div');
    actionButtonsDiv.className = 'action-buttons-div';

    primaryButton = document.createElement('button');
    primaryButton.id = 'save-button';
    primaryButton.type = 'button';

    deleteButton = document.createElement('button');
    deleteButton.id = 'delete-button';
    deleteButton.textContent = 'Delete Task';
    deleteButton.type = 'button';

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(titleFieldGroup);
    modalContent.appendChild(descriptionLabel);
    modalContent.appendChild(descriptionTextarea);
    modalContent.appendChild(statusLabel);
    modalContent.appendChild(statusSelect);
    modalContent.appendChild(actionButtonsDiv);

    modal.appendChild(closeButton);
    modal.appendChild(modalContent);

    document.body.appendChild(modalBackdrop);
    modalBackdrop.appendChild(modal);

    setupModalEventListeners(); 

}
/**
 * Sets up event listeners for the modal's primary (save/create) and delete buttons.
 * This function should be called after modal elements are created.
 * @returns {void}
 */
function setupModalEventListeners() {
    /**
     * Event listener for the primary action button (Create Task / Save Changes).
     * Performs validation and calls appropriate task management functions.
     * @returns {void}
     */
    primaryButton.addEventListener('click', () => {
        console.log('[Primary Button Click] Fired.');

        // On submit, explicitly validate. If empty, show message and return.
        if (titleInput.value.trim() === '') {
            updateTitleValidation(false); // Force show validation message
            titleInput.focus();
            return; // Stop execution
        }

        // If validation passes
        updateTitleValidation(true); // Ensure validation message is hidden before proceeding

        const title = titleInput.value.trim();
        const description = descriptionTextarea.value.trim();
        const status = statusSelect.value;

        if (currentTaskId) {
            updateTaskState(currentTaskId, title, description, status);
            console.log('[Primary Button Click] Task updated:', currentTaskId);
        } else {
            addNewTask(title, description, status);
            console.log('[Primary Button Click] New task added.');
        }

        modalBackdrop.style.display = 'none'; // Hide modal
        updateTitleValidation(true); // Final cleanup on modal close
    });

/**
     * Event listener for the delete task button (visible only in edit mode).
     * Calls the deleteTask function and closes the modal.
     * @returns {void}
     */
    deleteButton.addEventListener('click', () => {
        console.log('[Delete Button Click] Fired.');
        if (currentTaskId && confirm('Are you sure you want to delete this task?')) {
            deleteTask(currentTaskId);
            modalBackdrop.style.display = 'none';
            console.log('[Delete Button Click] Task deleted:', currentTaskId);
            updateTitleValidation(true); // Clean up validation state after deletion
        }
    });

}

/**
 * Opens a modal for adding a new task or editing an existing one.
 * Dynamically populates and displays the modal based on the provided task data.
 * Assumes modal elements have already been created by `createModalElements`.
 * It also handles the initial state of the title validation message.
 * @param {Task|null} task - The task object to display/edit, or `null` for a new task.
 * @returns {void}
 */
export function openTaskModal(task = null) {
    console.log('[openTaskModal] Called. Task:', task ? task.id : 'New Task');
    modalBackdrop.style.display = 'flex';

    // Reset form fields
    titleInput.value = '';
    descriptionTextarea.value = '';
    statusSelect.value = 'todo';

    // IMPORTANT: Reset ALL validation states when opening the modal
    updateTitleValidation(true); // Initially hide validation message

    const actionButtonsDiv = modal.querySelector('.action-buttons-div');
    actionButtonsDiv.innerHTML = '';

    if (task) {
        currentTaskId = task.id;
        modalTitle.textContent = 'Edit Task';
        titleInput.value = task.title;
        descriptionTextarea.value = task.description;
        statusSelect.value = task.status;
        primaryButton.textContent = 'Save Changes';
        actionButtonsDiv.appendChild(primaryButton);
        actionButtonsDiv.appendChild(deleteButton);
    } else {
        currentTaskId = null;
        modalTitle.textContent = 'Add New Task';
        primaryButton.textContent = 'Create Task';
        actionButtonsDiv.appendChild(primaryButton);
    }
}
