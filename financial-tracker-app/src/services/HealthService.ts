const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
// Health endpoint is at root level, not under /api
const BACKEND_URL = API_BASE_URL.replace('/api', '');

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  environment: string;
  database: {
    status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting' | 'unknown';
    connected: boolean;
  };
}

export class HealthService {
  private static readonly HEALTH_ENDPOINT = `${BACKEND_URL}/health`;
  private static readonly MAX_RETRIES = 5;
  private static readonly RETRY_DELAY = 2000; // 2 seconds

  /**
   * Check if the backend and database are healthy
   */
  static async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(this.HEALTH_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If health endpoint doesn't exist (404), assume backend is ready
      // This handles older backend deployments without /health endpoint
      if (response.status === 404) {
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          environment: 'production',
          database: {
            status: 'connected',
            connected: true,
          },
        };
      }

      if (!response.ok && response.status !== 503) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  /**
   * Wait for the database to be connected with retries
   */
  static async waitForConnection(
    onStatusChange?: (status: string, attempt: number) => void
  ): Promise<HealthCheckResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        onStatusChange?.(
          attempt === 1 ? 'Connecting to database...' : `Retrying connection (${attempt}/${this.MAX_RETRIES})...`,
          attempt
        );

        const health = await this.checkHealth();

        if (health.database.connected) {
          onStatusChange?.('Connected successfully!', attempt);
          return health;
        }

        // Database is not connected yet, but server is responding
        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY);
        }
      } catch (error) {
        lastError = error as Error;
        
        // If we can't even reach the server, wait before retry
        if (attempt < this.MAX_RETRIES) {
          onStatusChange?.(`Connection failed. Retrying in ${this.RETRY_DELAY / 1000}s...`, attempt);
          await this.delay(this.RETRY_DELAY);
        }
      }
    }

    throw new Error(
      lastError?.message || 'Failed to connect to database after multiple attempts. Please check your connection and try again.'
    );
  }

  /**
   * Utility to delay execution
   */
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if backend server is reachable (regardless of DB status)
   */
  static async isServerReachable(): Promise<boolean> {
    try {
      const response = await fetch(this.HEALTH_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok || response.status === 503; // 503 means server is up but DB is down
    } catch {
      return false;
    }
  }
}
