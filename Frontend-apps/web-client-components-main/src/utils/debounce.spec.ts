import { debounce } from './debounce';

describe('debounce', () => {
  jest.useFakeTimers();

  it('should call the function once after the delay', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).toBeCalledTimes(1);
  });

  it('should cancel the function', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    debouncedFunc.cancel();
    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();
  });
});
