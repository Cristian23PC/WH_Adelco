export const formatLocaleName = (localeName: string) => {
  return localeName.slice(0, 2).toUpperCase();
};

export const formatTitleCase = (str = ''): string => {
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

export const labelizeText = (str: string): string => {
  return str
    .trim()
    .split(/[\s-]+/) // split by empty spaces and hyphens
    .map((text) => formatCapitalizeText(text.trim()))
    .join(' ');
};
