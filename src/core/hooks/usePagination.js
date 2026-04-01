import { useCallback, useState } from 'react';

/**
 * @param {{ initialPage?: number, initialLimit?: number }} [options]
 */
export function usePagination(options = {}) {
  const { initialPage = 1, initialLimit = 10 } = options;
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = useCallback((next) => {
    setPage((p) => {
      const n = typeof next === 'function' ? next(p) : next;
      return Math.max(1, n);
    });
  }, []);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const resetPage = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    limit,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
  };
}
