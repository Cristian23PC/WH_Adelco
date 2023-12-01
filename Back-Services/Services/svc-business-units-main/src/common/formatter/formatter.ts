export const removeUndefinedValues = <T>(obj: unknown): T => {
  return JSON.parse(JSON.stringify(obj));
};
