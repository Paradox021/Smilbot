/**
 * Pagination state interface
 * Used to track the current position and limits in paginated views
 */
export interface PaginationState {
  /** Current page index (0-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Number of items to show per page */
  itemsPerPage: number;
  /** Total number of items */
  totalItems: number;
}

/**
 * Creates a new pagination state from an array of items
 * @param items Array of items to paginate
 * @param itemsPerPage Number of items per page (default: 10)
 * @returns PaginationState object
 */
export function createPaginationState<T>(
  items: T[],
  itemsPerPage: number = 10
): PaginationState {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  return {
    currentPage: 0,
    totalPages,
    itemsPerPage,
    totalItems,
  };
}

/**
 * Gets the items for the current page
 * @param items Full array of items
 * @param state Pagination state
 * @returns Array of items for the current page
 */
export function getPageItems<T>(items: T[], state: PaginationState): T[] {
  const start = state.currentPage * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  return items.slice(start, end);
}

/**
 * Checks if there's a next page available
 */
export function hasNextPage(state: PaginationState): boolean {
  return state.currentPage < state.totalPages - 1;
}

/**
 * Checks if there's a previous page available
 */
export function hasPreviousPage(state: PaginationState): boolean {
  return state.currentPage > 0;
}

/**
 * Gets the next page state
 */
export function nextPage(state: PaginationState): PaginationState {
  if (!hasNextPage(state)) return state;
  return { ...state, currentPage: state.currentPage + 1 };
}

/**
 * Gets the previous page state
 */
export function previousPage(state: PaginationState): PaginationState {
  if (!hasPreviousPage(state)) return state;
  return { ...state, currentPage: state.currentPage - 1 };
}

/**
 * Gets the first page state
 */
export function firstPage(state: PaginationState): PaginationState {
  return { ...state, currentPage: 0 };
}

/**
 * Gets the last page state
 */
export function lastPage(state: PaginationState): PaginationState {
  return { ...state, currentPage: state.totalPages - 1 };
}

/**
 * Creates pagination state from a page number
 */
export function goToPage(state: PaginationState, page: number): PaginationState {
  const validPage = Math.max(0, Math.min(page, state.totalPages - 1));
  return { ...state, currentPage: validPage };
}
