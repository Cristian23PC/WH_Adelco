import * as httpMock from 'node-mocks-http';
import { CurrentUser } from '../current-user.decorator';
import { ExecutionContext } from '@nestjs/common';

describe('current-user', () => {
  describe('CurrentUser', () => {
    function getDecoratorFactory(decorator: any, context: ExecutionContext): (decorator: any) => any {
      const request = {
        ...httpMock.createRequest(),
        user: { user: 'user' }
      };
      return () => decorator(request, context);
    }

    it('should call CurrentUser', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => httpMock.createRequest()
        })
      } as ExecutionContext;

      const decoratorFactory = getDecoratorFactory(CurrentUser, context);
      const decorator = decoratorFactory(context);
      expect(decorator).toBeDefined();
    });
  });
});
