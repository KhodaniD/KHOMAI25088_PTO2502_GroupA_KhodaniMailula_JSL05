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