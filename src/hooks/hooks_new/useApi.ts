import { useState, useEffect } from 'react';

export interface ApiData<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi<T>(url: string): ApiData<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  const refetch = () => {
    setRefreshCounter(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refreshCounter]);

  return { data, loading, error, refetch };
}
