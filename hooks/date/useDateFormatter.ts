import { useCallback } from 'react';

export function useDateFormatter() {
  return useCallback((value: number | Date) => {
    const d = typeof value === 'number' ? new Date(value) : value;
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, []);
}
