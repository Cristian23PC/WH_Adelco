const mockInject = jest.fn();

jest.mock('@nestjs/common', () => ({
  Inject: mockInject,
}));

import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { InjectRepository } from './nest-commercetools.decorators';

class Repository {
  byProjectKeyRequestBuilder: ByProjectKeyRequestBuilder;

  constructor(byProjectKeyRequestBuilder: ByProjectKeyRequestBuilder) {
    this.byProjectKeyRequestBuilder = byProjectKeyRequestBuilder;
  }
}

describe('Nest commercetools decorators', () => {
  describe('InjectRepository', () => {
    beforeEach(() => {
      InjectRepository(Repository);
    });

    it('should call Inject', () => {
      expect(mockInject).toHaveBeenCalledWith(Repository);
    });
  });
});
