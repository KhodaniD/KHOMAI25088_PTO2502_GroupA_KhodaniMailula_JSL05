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

