export const dateToString = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const areDatesEqual = (
  date1: Date | undefined,
  date2: Date | undefined
): boolean => {
  return date1?.toDateString() === date2?.toDateString();
};
