/**
 * Helper utilities for testing hooks
 */

import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

/**
 * Create a wrapper with React Query provider for testing hooks
 */
export function createQueryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Return a properly typed wrapper function
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

/**
 * Render a hook with React Query provider
 */
export function renderHookWithQueryClient<Result, Props>(
  hook: (props: Props) => Result
) {
  return renderHook(hook, {
    wrapper: createQueryClientWrapper(),
  });
}
