import type { UserModel } from '@syncfusion/ej2-react-blockeditor';
import { generateUser } from '../utils/mockData';

const USER_STORAGE_KEY = 'blockeditor-current-user';

let currentUser: UserModel | null = null;

/**
 * Get current active user
 * - Retrieves from sessionStorage if available
 * - Generates new user if not found
 */
export function getCurrentUser(): UserModel {
    if (!currentUser) {
        // Try to load from sessionStorage
        const storedUser = loadUserFromStorage();
        if (storedUser) {
            currentUser = storedUser;
        } else {
            // Generate new user and save to sessionStorage
            currentUser = generateUser();
            saveUserToStorage(currentUser);
        }
    }
    return currentUser;
}

/**
 * Set current active user
 */
export function setCurrentUser(user: UserModel): void {
    currentUser = user;
    saveUserToStorage(user);
}

/**
 * Load user from sessionStorage
 */
function loadUserFromStorage(): UserModel | null {
    try {
        const storedData = sessionStorage.getItem(USER_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData) as UserModel;
        }
    } catch (error) {
        console.error('Failed to load user from storage:', error);
    }
    return null;
}

/**
 * Save user to sessionStorage
 */
function saveUserToStorage(user: UserModel): void {
    try {
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Failed to save user to storage:', error);
    }
}
