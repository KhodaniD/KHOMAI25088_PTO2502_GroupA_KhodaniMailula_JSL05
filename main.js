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

document.addEventListener('DOMContentLoaded', () => {
  createModalElements(); // Create modal elements ONCE when DOM is loaded
  initializeTasks(); // Load tasks from storage or initialize default tasks
  renderTasks();      // Render the tasks on the Kanban board

  const addBtn = document.getElementById('add-new-task-btn');

  /**
   * Event listener for the "Add New Task" button.
   * Opens the task modal in "add new task" mode (by passing null).
   * @param {Event} event - The click event object.
   * @returns {void}
   */
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openTaskModal(null); // Open modal for adding a new task
    });
  }
});