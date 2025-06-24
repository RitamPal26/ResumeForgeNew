import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRetry } from '../../hooks/useRetry';

describe('useRetry Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute function successfully on first attempt', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useRetry(mockFn));

    let response;
    await act(async () => {
      response = await result.current.execute();
    });

    expect(response).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result.current.attempt).toBe(0);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should retry on failure and eventually succeed', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');

    const { result } = renderHook(() => useRetry(mockFn, { delay: 10 }));

    let response;
    await act(async () => {
      response = await result.current.execute();
    });

    expect(response).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(result.current.error).toBeNull();
  });

  it('should fail after max attempts', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('Persistent failure'));
    const onMaxAttemptsReached = vi.fn();

    const { result } = renderHook(() => 
      useRetry(mockFn, { 
        maxAttempts: 2, 
        delay: 10,
        onMaxAttemptsReached 
      })
    );

    let response;
    await act(async () => {
      response = await result.current.execute();
    });

    expect(response).toBeNull();
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(onMaxAttemptsReached).toHaveBeenCalledTimes(1);
  });

  it('should call onRetry callback', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValue('success');

    const onRetry = vi.fn();

    const { result } = renderHook(() => 
      useRetry(mockFn, { delay: 10, onRetry })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(onRetry).toHaveBeenCalledWith(1);
  });

  it('should reset state correctly', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('Failure'));

    const { result } = renderHook(() => useRetry(mockFn, { delay: 10 }));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBeInstanceOf(Error);

    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.attempt).toBe(0);
    expect(result.current.isLoading).toBe(false);
  });

  it('should use exponential backoff when enabled', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');

    const startTime = Date.now();
    const { result } = renderHook(() => 
      useRetry(mockFn, { delay: 100, backoff: true })
    );

    await act(async () => {
      await result.current.execute();
    });

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // With backoff: 100ms + 200ms = 300ms minimum
    expect(totalTime).toBeGreaterThan(250);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});