import { useState, useCallback } from 'react';

interface UseApiRequestOptions {
  retries?: number;
  retryDelay?: number; // ms
  friendlyError?: string;
}

interface UseApiRequestResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  request: (fn: () => Promise<T>) => Promise<void>;
}

/**
 * Hook para manejar peticiones API con loading, reintentos y mensajes amigables.
 */
export function useApiRequest<T = any>(options?: UseApiRequestOptions): UseApiRequestResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    let attempts = 0;
    const maxRetries = options?.retries ?? 2;
    const retryDelay = options?.retryDelay ?? 1500;
    const friendlyError = options?.friendlyError ?? 'El servidor está iniciando, por favor espera unos segundos y vuelve a intentar.';
    while (attempts <= maxRetries) {
      try {
        const result = await fn();
        setData(result);
        setLoading(false);
        return;
      } catch (err: any) {
        attempts++;
        if (attempts > maxRetries) {
          setError(friendlyError);
          setLoading(false);
          return;
        }
        await new Promise(res => setTimeout(res, retryDelay));
      }
    }
  }, [options]);

  return { data, loading, error, request };
}
