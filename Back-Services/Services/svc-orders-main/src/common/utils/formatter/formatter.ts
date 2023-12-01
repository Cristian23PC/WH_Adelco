export const removeUndefinedValues = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};
