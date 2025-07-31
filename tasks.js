/**
 * tasks.js
 * Handles task state management, rendering, and interactions for the Kanban board.
 * Manages the array of tasks, their CRUD operations, and their display in the UI.
 */

import { saveTasksToStorage, loadTasksFromStorage } from './storage.js';
import { openTaskModal } from './modal.js'; // Ensure modal is imported for task click interaction

/**
 * Represents a single task object.
 * @typedef {object} Task
 * @property {number} id - Unique identifier for the task.
 * @property {string} title - The title of the task.
 * @property {string} description - The detailed description of the task.
 * @property {string} status - The current status of the task ('todo', 'doing', 'done').
 */