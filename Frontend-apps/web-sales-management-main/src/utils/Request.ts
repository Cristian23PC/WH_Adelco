export const toQueryParams = (
  obj: Record<string, string | number | string[] | boolean | undefined>
): string => {
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return '';
  }

  const parts = keys
    .map((key) => {
      const data =
        typeof obj[key] === 'number' ? obj[key]?.toString() : obj[key];
      if (Array.isArray(data)) {
        if (data.length === 0) return '';

        const valuesEncoded = data.map(
          (v: string) => `${key.replace(/_/g, '.')}=${encodeURIComponent(v)}`
        );
        return valuesEncoded.join('&');
      }

      if (data) {
        const value = encodeURIComponent(data);

        return `${key.replace(/_/g, '.')}=${value}`;
      }
    })
    .filter(Boolean);

  const joined = parts.join('&');

  if (joined.length === 0) return '';

  return `?${joined}`;
};
