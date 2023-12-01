import { Request } from '@frontastic/extension-types';
import { getPath } from './Request';

export class SearchRouter {
  static identifyFrom(request: Request) {
    return Boolean(getPath(request)?.match(/^\/search/));
  }
}
