import { Request } from '@frontastic/extension-types';

const getHeader = (request: Request, header: string): string | null => {
  const foundHeader = request.headers?.[header];
  if (!foundHeader) {
    return null;
  }
  return Array.isArray(foundHeader) ? foundHeader[0] : foundHeader;
};

export const getPath = (request: Request): string | null => {
  return getHeader(request, 'frontastic-path') ?? request.query.path;
};

export const toQueryParams = (obj: Record<string, string | string[]>): string => {
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return '';
  }

  const parts = keys
    .map((key) => {
      const data = obj[key];

      if (Array.isArray(data)) {
        if (data.length === 0) return '';

        const valuesEncoded = data.map((v: string) => `${key.replace(/_/g, '.')}=${encodeURIComponent(v)}`);
        return valuesEncoded.join('&');
      }

      const value = encodeURIComponent(data);

      return `${key.replace(/_/g, '.')}=${value}`;
    })
    .filter(Boolean);

  const joined = parts.join('&');

  if (joined.length === 0) return '';

  return `?${joined}`;
};
