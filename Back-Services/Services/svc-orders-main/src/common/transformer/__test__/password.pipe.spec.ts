import { Hash } from '@/common/utils';
import { PasswordTransformer } from '../password.pipe';

describe('PasswordPipe', () => {
  let passwordTransformer: PasswordTransformer;
  beforeEach(() => {
    passwordTransformer = new PasswordTransformer();
    jest.resetAllMocks();
  });
  it('to() method should be called', () => {
    const spyMock = jest.spyOn(Hash, 'make');
    passwordTransformer.to('test');
    expect(spyMock).toBeCalled();
  });

  it('from() method should be called', () => {
    expect(passwordTransformer.from('test')).toEqual('test');
  });
});
