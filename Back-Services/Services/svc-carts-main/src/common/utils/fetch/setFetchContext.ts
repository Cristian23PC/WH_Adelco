import { AsyncLocalStorage } from 'async_hooks';
import fetch from 'node-fetch';

const asyncLocalStorage = new AsyncLocalStorage<FetchContext>();

(global as any).fetch = async (url: string, options: FetchOptions = {}) => {
  const context = asyncLocalStorage.getStore();
  return await fetch(url, {
    ...options,
    headers: {
      ...context.headers,
      ...options.headers
    }
  });
};

type Headers = { [key: string]: string };

export interface FetchContext {
  headers: Headers;
}

interface FetchOptions {
  method?: string;
  headers?: Headers;
  body?: string;
  mode?: string;
  credentials?: 'omit' | 'same-origin' | 'include';
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  referrerPolicy?: string;
  integrity?: string;
  keepAlive?: boolean;
  signal?: AbortSignal;
  priority?: 'high' | 'low' | 'auto';
}

export function withContext(context: FetchContext, fn) {
  return asyncLocalStorage.run<FetchContext, any[]>(context, fn);
}
