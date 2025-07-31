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

/**
 * Initial task data (immutable on first run if no data in storage).
 * @type {Task[]}
 */
const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
  },
  {
    id: 2,
    title: "Conquer React ⚛️",
    description: "Become proficient in React.js and its ecosystem.",
    status: "todo",
  },
  {
    id: 3,
    title: "Understand Databases ⚙️",
    description: "Learn about relational and non-relational databases, and how to query them.",
    status: "todo",
  },
  {
    id: 4,
    title: "Crush Frameworks 🖼️",
    description: "Master popular web frameworks like Next.js, Angular, or Vue.",
    status: "todo",
  },
  {
    id: 5,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals of JavaScript, including ES6+ features.",
    status: "doing",
  },
  {
    id: 6,
    title: "Never Give Up 🏆",
    description: "Stay persistent and motivated throughout your coding journey.",
    status: "doing",
  },
  {
    id: 7,
    title: "Explore ES6 Features 🚀",
    description: "Dive deep into modern JavaScript features like arrow functions, destructuring, and async/await.",
    status: "done",
  },
  {
    id: 8,
    title: "Have fun 🥳",
    description: "Remember to enjoy the process of learning and building amazing things!",
    status: "done",
  },
];

/**
 * The current state of tasks in the application.
 * This array is manipulated directly for CRUD operations.
 * @type {Task[]}
 */
let currentTasksState = [];

/**
 * Initializes the task state by loading from localStorage.
 * If no tasks are found in storage, the initialTasks array is used
 * and saved to localStorage.
 * @returns {void}
 */
export function initializeTasks() {
  const storedTasks = loadTasksFromStorage();
  if (storedTasks && Array.isArray(storedTasks) && storedTasks.length > 0) {
    currentTasksState = storedTasks;
  } else {
    currentTasksState = [...initialTasks]; // Use a copy to avoid mutating the original
    saveTasksToStorage(currentTasksState);
  }
}

/**
 * Creates a DOM element for a given task.
 * Adds a click event listener to open the task modal for editing.
 * @param {Task} task - The task object to create an element for.
 * @returns {HTMLDivElement} The created task DOM element.
 */
function createTaskElement(task) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task-div';
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id; // Store task ID for easy retrieval

  /**
   * Event listener for clicking on a task card.
   * Opens the task modal for editing the clicked task.
   * @param {Event} event - The click event object.
   * @returns {void}
   */
  taskDiv.addEventListener('click', () => openTaskModal(task));
  return taskDiv;
}

/**
 * Updates the displayed task count for each column header.
 * Iterates through each status column and updates the count based on `currentTasksState`.
 * @returns {void}
 */
function updateTaskCountDisplays() {
  const statuses = ['todo', 'doing', 'done'];
  statuses.forEach(status => {
    const count = currentTasksState.filter(task => task.status === status).length;
    // Select the specific column header using data-status attribute
    const headerElement = document.querySelector(`.column-div[data-status="${status}"] .columnHeader`);
    if (headerElement) {
      // Extract original text (e.g., "TODO") and update count
      const currentText = headerElement.textContent.split('(')[0].trim();
      headerElement.textContent = `${currentText} (${count})`;
    }
  });
}

/**
 * Renders all tasks from the global `currentTasksState` array into their respective Kanban board columns.
 * Clears existing tasks before rendering to prevent duplicates and then updates task counts.
 * @returns {void}
 */
export function renderTasks() {
  // Clear all existing tasks from containers to prevent duplicates on re-render
  document.querySelectorAll('.tasks-container').forEach(container => {
    container.innerHTML = '';
  });

  // Append each task to its corresponding status column
  currentTasksState.forEach(task => {
    const taskElement = createTaskElement(task);
    const targetContainer = document.querySelector(`.column-div[data-status="${task.status}"] .tasks-container`);
    if (targetContainer) {
      targetContainer.appendChild(taskElement);
    }
  });

  updateTaskCountDisplays(); // Update column task counts after rendering
}

/**
 * Adds a new task to the `currentTasksState` array, updates storage, and re-renders the tasks.
 * Assigns a unique ID to the new task.
 * @param {string} title - The title of the new task.
 * @param {string} description - The description of the new task.
 * @param {string} status - The status of the new task ('todo', 'doing', 'done').
 * @returns {void}
 */
export function addNewTask(title, description, status) {
  // Generate a unique ID for the new task
  const newId = currentTasksState.length > 0 ? Math.max(...currentTasksState.map(t => t.id)) + 1 : 1;
  const newTask = {
    id: newId,
    title,
    description,
    status,
  };
  currentTasksState = [...currentTasksState, newTask]; // Add new task to the state
  saveTasksToStorage(currentTasksState);               // Persist updated state
  renderTasks();                                       // Re-render tasks on the board
}

/**
 * Updates an existing task in the `currentTasksState` array, updates storage, and re-renders tasks.
 * @param {number} id - The ID of the task to update.
 * @param {string} newTitle - The new title for the task.
 * @param {string} newDescription - The new description for the task.
 * @param {string} newStatus - The new status for the task ('todo', 'doing', 'done').
 * @returns {void}
 */
export function updateTaskState(id, newTitle, newDescription, newStatus) {
  currentTasksState = currentTasksState.map(task => {
    if (task.id === id) {
      return {
        ...task, // Copy existing properties
        title: newTitle,
        description: newDescription,
        status: newStatus,
      };
    }
    return task; // Return unchanged task if ID doesn't match
  });
  saveTasksToStorage(currentTasksState); // Persist updated state
  renderTasks();                          // Re-render tasks on the board
}



