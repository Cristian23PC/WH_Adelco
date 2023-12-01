import { useState, useEffect } from 'react';
import tailwindConfig from '../../tailwind.config';

export interface ScreenSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const screens: Record<string, number> = Object.entries(
  tailwindConfig.theme.screens
).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: parseInt(value.replace(/\D/g, ''))
  }),
  {}
);

const useScreen = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState({
    isMobile: true,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const handleResize: VoidFunction = () => {
      const screenWidth = window.innerWidth;

      const { desktop, tablet } = screens;
      const screenSize = {
        isMobile: screenWidth < tablet,
        isTablet: screenWidth >= tablet && screenWidth < desktop,
        isDesktop: screenWidth >= desktop
      };
      setScreenSize(screenSize);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return screenSize;
};

export default useScreen;
