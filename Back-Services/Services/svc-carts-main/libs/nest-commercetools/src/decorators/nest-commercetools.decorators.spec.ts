const mockInject = jest.fn();

jest.mock('@nestjs/common', () => ({
  Inject: mockInject,
}));

import { InjectRepository } from './nest-commercetools.decorators';

class Repository {
  byProjectKeyRequestBuilder: any;

  constructor(byProjectKeyRequestBuilder: any) {
    this.byProjectKeyRequestBuilder = byProjectKeyRequestBuilder;
  }
}

describe('Nest commercetools decorators', () => {
  describe('InjectRepository', () => {
    beforeEach(() => {
      InjectRepository(Repository);
    });

    test('should call Inject', () => {
      expect(mockInject).toHaveBeenCalledWith(Repository);
    });
  });
});
