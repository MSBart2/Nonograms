// Authentication module - Local storage based authentication
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }

    loadUsers() {
        const users = localStorage.getItem('nonogram_users');
        return users ? JSON.parse(users) : {};
    }

    saveUsers() {
        localStorage.setItem('nonogram_users', JSON.stringify(this.users));
    }

    register(username, password) {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        if (username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (this.users[username]) {
            throw new Error('Username already exists');
        }

        // Simple hash (in production, use proper hashing)
        this.users[username] = {
            password: btoa(password), // Base64 encoding (not secure, but simple)
            createdAt: new Date().toISOString()
        };

        this.saveUsers();
        return true;
    }

    login(username, password) {
        if (!this.users[username]) {
            throw new Error('Invalid username or password');
        }

        const user = this.users[username];
        if (user.password !== btoa(password)) {
            throw new Error('Invalid username or password');
        }

        this.currentUser = username;
        sessionStorage.setItem('nonogram_current_user', username);
        return true;
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('nonogram_current_user');
    }

    isLoggedIn() {
        if (!this.currentUser) {
            this.currentUser = sessionStorage.getItem('nonogram_current_user');
        }
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser || sessionStorage.getItem('nonogram_current_user');
    }
}

// Create global auth manager instance
window.authManager = new AuthManager();
