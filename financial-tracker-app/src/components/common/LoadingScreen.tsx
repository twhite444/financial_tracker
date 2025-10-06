import React from 'react';
import { Loader2, Database, AlertCircle } from 'lucide-react';

interface LoadingScreenProps {
  status: 'loading' | 'error' | 'success';
  message?: string;
  error?: string;
  onRetry?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  status,
  message = 'Connecting to database...',
  error,
  onRetry,
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center z-50">
      <div className="text-center px-6">
        {/* Animated Logo/Icon */}
        <div className="relative mb-8">
          {status === 'loading' && (
            <>
              {/* Outer rotating ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
              </div>
              
              {/* Middle pulsing ring */}
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 opacity-50"></div>
              </div>
              
              {/* Center icon */}
              <div className="relative flex items-center justify-center h-32">
                <Database className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
            </>
          )}

          {status === 'error' && (
            <div className="relative flex items-center justify-center h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-red-100 dark:bg-red-900 opacity-20 animate-pulse"></div>
              </div>
              <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400 relative" />
            </div>
          )}

          {status === 'success' && (
            <div className="relative flex items-center justify-center h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-green-100 dark:bg-green-900 opacity-20 scale-0 animate-ping"></div>
              </div>
              <Database className="w-12 h-12 text-green-600 dark:text-green-400 relative" />
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {status === 'loading' && 'Connecting...'}
            {status === 'error' && 'Connection Failed'}
            {status === 'success' && 'Connected!'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {status === 'error' ? error || 'Unable to connect to the database' : message}
          </p>

          {/* Loading dots animation */}
          {status === 'loading' && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}

          {/* Retry Button */}
          {status === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Loader2 className="w-4 h-4" />
              Retry Connection
            </button>
          )}

          {/* Additional Info for Slow Connections */}
          {status === 'loading' && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
              This may take a moment if the database is waking up...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
