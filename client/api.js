const API_BASE_URL = 'http://localhost:5000';

/**
 * --- NEW: TEACHER REGISTRATION ---
 * Sends new teacher details (first name, last name, email, password) to the server.
 * If successful, it stores the authentication token in localStorage to log the user in immediately.
 * @param {string} firstName The teacher's first name.
 * @param {string} lastName The teacher's last name.
 * @param {string} email The teacher's email.
 * @param {string} password The teacher's password.
 * @returns {Promise<object>} The server's response data, including the token.
 * @throws {Error} If the registration fails (e.g., email already exists).
 */
async function registerTeacher(firstName, lastName, email, password) {
    const response = await fetch(`${API_BASE_URL}/api/teachers/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed. Please try again.');
    }

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    return data;
}

/**
 * --- TEACHER LOGIN ---
 * Sends the teacher's email and password to the server.
 * If successful, it stores the authentication token in localStorage.
 * @param {string} email The teacher's email.
 * @param {string} password The teacher's password.
 * @returns {Promise<object>} The server's response data.
 * @throws {Error} If the login fails.
 */
async function loginTeacher(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/teachers/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
    }

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    return data;
}

/**
 * --- ADD A NEW LOST ITEM (Protected) ---
 * Sends the form data, including the image file, to the server.
 * It includes the auth token in the headers to prove the user is logged in.
 * @param {FormData} formData The form data object containing description, locations, and the image.
 * @returns {Promise<object>} The newly created item object.
 * @throws {Error} If adding the item fails.
 */
async function addNewItem(formData) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('You are not logged in. Please log in to add an item.');
    }

    const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add the item.');
    }
    return response.json();
}

/**
 * --- MARK ITEM AS COLLECTED (Protected) ---
 * Sends a request to update an item's status to "Collected".
 * @param {string} itemId The unique ID of the item to update.
 * @returns {Promise<object>} The updated item object.
 * @throws {Error} If the update fails.
 */
async function markAsCollected(itemId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('You are not logged in. Please log in to perform this action.');
    }

    const response = await fetch(`${API_BASE_URL}/api/items/${itemId}/collect`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update item status.');
    }
    return response.json();
}

/**
 * --- GET ALL LOST ITEMS (Public) ---
 * Fetches all items with the status 'Lost' for the student view.
 * @returns {Promise<Array>} An array of lost item objects.
 * @throws {Error} If fetching fails.
 */
async function getLostItems() {
    const response = await fetch(`${API_BASE_URL}/api/items/lost`);
    if (!response.ok) {
        throw new Error('Could not fetch the list of lost items.');
    }
    return response.json();
}

/**
 * --- GET ALL COLLECTED ITEMS (Public) ---
 * Fetches all items with the status 'Collected' for the history view.
 * @returns {Promise<Array>} An array of collected item objects.
 * @throws {Error} If fetching fails.
 */
async function getCollectedItems() {
    const response = await fetch(`${API_BASE_URL}/api/items/collected`);
    if (!response.ok) {
        throw new Error('Could not fetch the history of collected items.');
    }
    return response.json();
}