export const splitPrefix = (phone: string = ''): Array<string | undefined> => {
  const [, prefix, number] = phone.match(/^(56)?(.+)$/) ?? [];

  if (!prefix) return [undefined, phone];
  return [prefix, number];
};

export const formatPhone = (phone: string = ''): string => {
  const numericOnly = phone.replace(/\D/g, '');

  const parts = [
    numericOnly.slice(0, 1),
    numericOnly.slice(1, 5),
    numericOnly.slice(5, 9)
  ].filter(Boolean);

  const formattedNumber = parts.join(' ');

  return formattedNumber;
};

export const postFormatPhone = (prefix: string, phone: string): string => {
  return `${prefix}${phone.split(' ').join('')}`;
};
