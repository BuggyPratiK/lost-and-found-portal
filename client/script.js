// --- MAIN ENTRY POINT ---
// This is the core of our script. It waits for the HTML document to be fully loaded
// before trying to run any code that interacts with the page.
document.addEventListener('DOMContentLoaded', () => {
    // This "router" checks which page is currently active by looking for a unique
    // element ID and then runs the appropriate initialization function.
    
    // --- UPDATED: Added a check for the new registration form ---
    if (document.getElementById('admin-register-form')) {
        initializeRegisterPage();
    }
    if (document.getElementById('admin-login-form')) {
        initializeLoginPage();
    }
    if (document.getElementById('add-item-form')) {
        initializeAdminDashboard();
    }
    // Correctly identifies the student view page by its unique element ID.
    if (document.getElementById('lost-items-page')) { 
        initializeStudentView();
    }
    if (document.getElementById('history-list')) {
        initializeHistoryPage();
    }
});


// --- PAGE INITIALIZATION FUNCTIONS ---

/**
 * --- NEW: This function sets up all the logic for the Admin Registration page. ---
 */
function initializeRegisterPage() {
    const registerForm = document.getElementById('admin-register-form');
    const errorMessage = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Call the registerTeacher function from our api.js file.
            await registerTeacher(firstName, lastName, email, password);
            // If registration is successful, the user is automatically logged in
            // (token is saved), so we can redirect them straight to the dashboard.
            window.location.href = 'admin-dashboard.html';
        } catch (error) {
            // If registration fails (e.g., email already in use), display the error.
            errorMessage.textContent = error.message;
        }
    });
}

/**
 * This function sets up all the logic needed for the Admin Login page.
 */
function initializeLoginPage() {
    const loginForm = document.getElementById('admin-login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await loginTeacher(email, password);
            window.location.href = 'admin-dashboard.html';
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}

/**
 * This function sets up all the logic for the Admin Dashboard.
 */
function initializeAdminDashboard() {
    const addItemForm = document.getElementById('add-item-form');
    const logoutButton = document.getElementById('logout-btn');
    const lostListContainer = document.getElementById('lost-items-grid');

    addItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addItemForm);
        try {
            await addNewItem(formData);
            addItemForm.reset();
            fetchAndRenderAdminItems(lostListContainer);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'admin-login.html';
    });

    fetchAndRenderAdminItems(lostListContainer);
}

/**
 * This function sets up the Student View page (now student-view.html).
 */
function initializeStudentView() {
    const lostListContainer = document.getElementById('lost-list');
    fetchAndRenderPublicItems(lostListContainer, 'lost');
}

/**
 * This function sets up the Collected Items History page.
 */
function initializeHistoryPage() {
    const historyListContainer = document.getElementById('history-list');
    fetchAndRenderPublicItems(historyListContainer, 'collected');
}


// --- DATA FETCHING & RENDERING FUNCTIONS ---

async function fetchAndRenderAdminItems(container) {
    container.innerHTML = '<h2>Loading items...</h2>';
    try {
        const items = await getLostItems();
        if (items.length === 0) {
            container.innerHTML = '<p>No lost items have been reported yet.</p>';
            return;
        }
        container.innerHTML = '';
        items.forEach(item => {
            const card = createItemCard(item, true);
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p style="color: red;">Error loading items: ${error.message}</p>`;
    }
}

async function fetchAndRenderPublicItems(container, type) {
    container.innerHTML = '<h2>Loading items...</h2>';
    try {
        const items = type === 'lost' ? await getLostItems() : await getCollectedItems();
        if (items.length === 0) {
            container.innerHTML = `<p>No ${type} items have been found.</p>`;
            return;
        }
        container.innerHTML = '';
        items.forEach(item => {
            const card = createItemCard(item, false);
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p style="color: red;">Error loading items: ${error.message}</p>`;
    }
}


// --- HELPER FUNCTION ---

function createItemCard(item, isAdmin) {
    const card = document.createElement('div');
    card.className = 'card';
    const imageUrl = `${API_BASE_URL}/${item.imagePath.replace(/\\/g, '/')}`;

    card.innerHTML = `
        <img src="${imageUrl}" alt="${item.description}" style="width:100%; height: 220px; object-fit: cover; border-radius: 8px 8px 0 0;">
        <div class="card-content" style="padding: 15px;">
            <h3>${item.description}</h3>
            <p><strong>Found at:</strong> ${item.foundLocation}</p>
            <p><strong>Collect from:</strong> ${item.collectionLocation}</p>
        </div>
    `;

    if (isAdmin) {
        const button = document.createElement('button');
        button.textContent = 'Mark as Collected';
        button.className = 'btn';
        button.style.margin = '0 15px 15px 15px';
        
        button.onclick = async () => {
            if (confirm('Are you sure you want to mark this item as collected?')) {
                try {
                    await markAsCollected(item._id);
                    fetchAndRenderAdminItems(document.getElementById('lost-items-grid'));
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            }
        };
        card.appendChild(button);
    }
    return card;
}