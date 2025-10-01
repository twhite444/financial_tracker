export class AuthService {
    private users: Map<string, string>; // Map to store username and password pairs
    private loggedInUser: string | null;

    constructor() {
        this.users = new Map();
        this.loggedInUser = null;
    }

    register(username: string, password: string): boolean {
        if (this.users.has(username)) {
            return false; // User already exists
        }
        this.users.set(username, password);
        return true; // Registration successful
    }

    login(username: string, password: string): boolean {
        const storedPassword = this.users.get(username);
        if (storedPassword && storedPassword === password) {
            this.loggedInUser = username;
            return true; // Login successful
        }
        return false; // Login failed
    }

    logout(): void {
        this.loggedInUser = null; // Clear logged in user
    }

    isAuthenticated(): boolean {
        return this.loggedInUser !== null; // Check if user is logged in
    }

    getCurrentUser(): string | null {
        return this.loggedInUser; // Return the currently logged in user
    }
}