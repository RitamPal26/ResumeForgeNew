import { useState, useCallback } from 'react';
import { showToast } from '../components/ui/Toast';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number) => void;
  onMaxAttemptsReached?: () => void;
}

interface UseRetryReturn<T> {
  execute: () => Promise<T | null>;
  isLoading: boolean;
  error: Error | null;
  attempt: number;
  reset: () => void;
}

export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: RetryOptions = {}
): UseRetryReturn<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry,
    onMaxAttemptsReached,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const execute = useCallback(async (): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    for (let currentAttempt = 1; currentAttempt <= maxAttempts; currentAttempt++) {
      setAttempt(currentAttempt);

      try {
        const result = await asyncFunction();
        setIsLoading(false);
        setAttempt(0);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        
        if (currentAttempt === maxAttempts) {
          setError(error);
          setIsLoading(false);
          onMaxAttemptsReached?.();
          
          showToast.error(
            `Failed after ${maxAttempts} attempts: ${error.message}`,
            {
              label: 'Retry',
              onClick: () => execute(),
            }
          );
          
          return null;
        }

        onRetry?.(currentAttempt);
        
        // Calculate delay with optional exponential backoff
        const currentDelay = backoff ? delay * Math.pow(2, currentAttempt - 1) : delay;
        
        showToast.warning(
          `Attempt ${currentAttempt} failed. Retrying in ${currentDelay / 1000}s...`
        );

        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }

    setIsLoading(false);
    return null;
  }, [asyncFunction, maxAttempts, delay, backoff, onRetry, onMaxAttemptsReached]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setAttempt(0);
  }, []);

  return {
    execute,
    isLoading,
    error,
    attempt,
    reset,
  };
}

// Network-specific retry hook
export function useNetworkRetry<T>(
  asyncFunction: () => Promise<T>,
  options: Omit<RetryOptions, 'maxAttempts'> = {}
) {
  return useRetry(asyncFunction, {
    maxAttempts: 3,
    delay: 1000,
    backoff: true,
    ...options,
    onRetry: (attempt) => {
      console.log(`Network retry attempt ${attempt}`);
      options.onRetry?.(attempt);
    },
  });
}