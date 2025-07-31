/**
 * main.js
 * Entry point: bootstraps the application and wires up global events.
 * This module is responsible for the initial setup and coordination of other modules.
 */

import { initializeTasks, renderTasks } from './tasks.js';
import { openTaskModal, createModalElements } from './modal.js'; // Import createModalElements

/**
 * Initializes the application when the DOM is fully loaded.
 * It creates the modal elements, loads tasks, renders them to the board, and sets up the event listener
 * for the "Add New Task" button.
 * @returns {void}
 */
