import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { correlationIdHeader } from '@/common/constants/headers';
import { withContext, FetchContext } from '../utils/fetch/setFetchContext';

@Injectable()
export class HeaderPropagationMiddleware implements NestMiddleware {
  use(request: Request, _, next: NextFunction) {
    const context: FetchContext = {
      headers: {
        [correlationIdHeader]: request.headers[correlationIdHeader] as string
      }
    };
    withContext(context, next);
  }
}
