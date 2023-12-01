import { renderHook } from '@testing-library/react-hooks';
import useScreen from './useScreen';

describe('useScreen', () => {
  const { innerWidth } = window;
  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1024
    });
  });

  afterAll(() => {
    window.innerWidth = innerWidth;
  });

  it('should return initial screen size', () => {
    const { result } = renderHook(() => useScreen());
    expect(result.current).toEqual({
      isMobile: false,
      isTablet: true,
      isDesktop: false
    });
  });

  it('should update screen size on window resize', () => {
    const { result } = renderHook(() => useScreen());
    expect(result.current).toEqual({
      isMobile: false,
      isTablet: true,
      isDesktop: false
    });

    Object.defineProperty(window, 'innerWidth', {
      value: 1340
    });
    window.dispatchEvent(new Event('resize'));

    expect(result.current).toEqual({
      isMobile: false,
      isTablet: false,
      isDesktop: true
    });

    Object.defineProperty(window, 'innerWidth', {
      value: 320
    });
    window.dispatchEvent(new Event('resize'));
    expect(result.current).toEqual({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });
  });
});
