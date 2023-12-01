export const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

export const searchString = (str: string, query: string) => {
  return removeAccents(str.toLowerCase().trim()).includes(
    removeAccents(query.toLowerCase().trim())
  );
};
