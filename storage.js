/**
 * storage.js
 * Handles all localStorage operations for persisting and retrieving tasks.
 * This module provides functions to save and load task data from the browser's local storage,
 * ensuring data persistence across sessions.
 */

/**
 * The key under which tasks are stored in localStorage.
 * This constant ensures consistency when accessing tasks in storage.
 * @type {string}
 */
const LOCAL_STORAGE_KEY = 'kanbanTasks';

/**
 * Saves the given array of tasks to localStorage.
 * The tasks array is converted to a JSON string before saving.
 * @param {Task[]} tasks - An array of task objects to be saved.
 * @returns {void}
 */
export function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to local storage:", error);
    // Optionally, alert the user or handle storage full errors
  }
}

