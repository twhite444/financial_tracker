const API_URL = 'http://localhost:5001/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'user_data';

  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.errors?.[0]?.msg || 'Registration failed',
        };
      }

      // Store token and user data
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Invalid email or password',
        };
      }

      // Store token and user data
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async getProfile(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch profile' };
      }

      // Update stored user data
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
}