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

/**
 * Loads tasks from localStorage.
 * Retrieves the JSON string from storage and parses it back into an array of task objects.
 * If no data is found or an error occurs during parsing, it returns null.
 * @returns {Task[]|null} An array of task objects, or null if no tasks are found or an error occurs.
 */
export function loadTasksFromStorage() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    return null; // No data found in local storage
  }
  try {
    return JSON.parse(data); // Parse the JSON string back to an array
  } catch (error) {
    console.error("Error parsing tasks from local storage:", error);
    // Clear corrupted data to prevent future parsing errors
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null; // Return null if data is corrupted
  }
}