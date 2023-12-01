export const ELLIPSIS = '...';
export type PageElement = number | typeof ELLIPSIS;

export const getPaginatorElements = (
  totalPages: number,
  currentPage: number
): PageElement[] => {
  const elements: PageElement[] = [];
  const isNotNeccessaryEllipsis = totalPages <= 5;
  const isOnFirstThreePages = currentPage <= 3;
  const isOnLastThreePages = currentPage > totalPages - 3;

  if (isNotNeccessaryEllipsis) {
    for (let i = 1; i <= totalPages; i++) {
      elements.push(i);
    }

    return elements;
  }

  if (isOnFirstThreePages) {
    return [1, 2, 3, ELLIPSIS, totalPages];
  }

  if (isOnLastThreePages) {
    for (let i = totalPages; i > totalPages - 3; i--) {
      elements.unshift(i);
    }

    return [1, ELLIPSIS, ...elements];
  }

  return [1, ELLIPSIS, currentPage, ELLIPSIS, totalPages];
};
