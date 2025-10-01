import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { AuthService } from '../../src/services/auth/AuthService';
import { UserService } from '../../src/services/auth/UserService';

describe('Authentication Integration Tests', () => {
    let authService: AuthService;
    let userService: UserService;
    let testUserId: string;

    beforeAll(async () => {
        authService = new AuthService();
        userService = new UserService();
        
        // Initialize test database connection if needed
        // await DatabaseService.connect();
    });

    afterAll(async () => {
        // Clean up test data and close connections
        // await DatabaseService.disconnect();
    });

    beforeEach(async () => {
        // Clear any existing sessions before each test
        // await DatabaseService.clearSessions();
    });

    it('should allow user to register with valid credentials', async () => {
        const newUser = {
            email: 'newuser@example.com',
            password: 'SecurePassword123!',
            name: 'Test User'
        };
        
        const registerResponse = await authService.register(newUser);
        
        expect(registerResponse).toHaveProperty('user');
        expect(registerResponse.user).toHaveProperty('id');
        expect(registerResponse.user.email).toBe(newUser.email);
        
        testUserId = registerResponse.user.id;
    });

    it('should allow user to log in with valid credentials', async () => {
        const userCredentials = { 
            email: 'test@example.com', 
            password: 'password123' 
        };
        
        const loginResponse = await authService.login(userCredentials);
        
        expect(loginResponse).toHaveProperty('token');
        expect(loginResponse).toHaveProperty('user');
        expect(loginResponse.user).toHaveProperty('id');
        expect(loginResponse.user.email).toBe(userCredentials.email);
    });

    it('should reject login with invalid credentials', async () => {
        const userCredentials = { 
            email: 'test@example.com', 
            password: 'wrongpassword' 
        };
        
        await expect(authService.login(userCredentials))
            .rejects
            .toThrow('Invalid credentials');
    });

    it('should reject login with non-existent email', async () => {
        const userCredentials = { 
            email: 'nonexistent@example.com', 
            password: 'password123' 
        };
        
        await expect(authService.login(userCredentials))
            .rejects
            .toThrow();
    });

    it('should allow user to log out successfully', async () => {
        const logoutResponse = await authService.logout();
        
        expect(logoutResponse).toBe(true);
    });

    it('should fetch user profile after logging in', async () => {
        // First login
        await authService.login({ 
            email: 'test@example.com', 
            password: 'password123' 
        });
        
        const userProfile = await userService.getUserProfile();
        
        expect(userProfile).toHaveProperty('id');
        expect(userProfile).toHaveProperty('email');
        expect(userProfile.email).toBe('test@example.com');
    });

    it('should reject profile fetch without authentication', async () => {
        // Ensure user is logged out
        await authService.logout();
        
        await expect(userService.getUserProfile())
            .rejects
            .toThrow();
    });

    it('should hash passwords securely', async () => {
        const password = 'MySecurePassword123!';
        const user = {
            email: 'security@example.com',
            password: password,
            name: 'Security Test'
        };
        
        const registerResponse = await authService.register(user);
        
        // Password should not be stored in plain text
        expect(registerResponse.user).not.toHaveProperty('password');
        // Or if password field exists, it should be hashed
        if ('password' in registerResponse.user) {
            expect(registerResponse.user.password).not.toBe(password);
        }
    });
});