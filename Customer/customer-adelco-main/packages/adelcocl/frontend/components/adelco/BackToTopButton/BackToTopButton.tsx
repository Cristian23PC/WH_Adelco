import { Button } from '@adelco/web-components';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import useScreen from 'helpers/hooks/useScreen';

const SCROLL_DISTANCE = 200;

const BackToTopButton: React.FC = () => {
  const [showButton, setShowButton] = useState<boolean>(false);
  const [bottomSpacing, setBottomSpacing] = useState<number>(4);
  const { isMobile } = useScreen();

  useEffect(() => {
    const checkScroll = () => {
      const footerElement = document.querySelector(
        'div[data-testid="adelco-footer"]'
      ) as HTMLElement;
      const footerHeight = footerElement ? footerElement.offsetHeight : 0;

      const scrollPosition = window.scrollY + window.innerHeight;
      const distanceFromFooter =
        document.body.offsetHeight - footerHeight - scrollPosition;

      if (window.scrollY > SCROLL_DISTANCE) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }

      if (distanceFromFooter < 0) {
        setBottomSpacing(-distanceFromFooter);
      } else {
        setBottomSpacing(0);
      }
    };

    window.addEventListener('scroll', checkScroll);

    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  return (
    <Button
      variant="secondary"
      iconName="arrow_up"
      size={isMobile ? 'md' : 'sm'}
      className={classNames(
        'right-4 tablet:right-6 desktop:right-[50px]',
        'bottom-4 tablet:bottom-6',
        'fixed transition-opacity duration-300',
        showButton ? 'opacity-100' : 'opacity-0'
      )}
      style={{ marginBottom: `${bottomSpacing}px` }}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }}
    />
  );
};

export default BackToTopButton;
