export const formatLocaleName = (localeName: string) => {
  return localeName.slice(0, 2).toUpperCase();
};

export const formatTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export const formatCapitalizeText = (str: string): string => {
  const name = str.toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
};
