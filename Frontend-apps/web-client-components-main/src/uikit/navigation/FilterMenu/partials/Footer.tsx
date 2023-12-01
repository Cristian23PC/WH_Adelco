import React, { type FC } from 'react';
import { Button } from '../../../actions';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import { type defaultLiterals } from '../mocks';

interface FooterProps {
  onClear: VoidFunction;
  onApply: VoidFunction;
  literals: { [key in keyof typeof defaultLiterals]: string };
}
const Footer: FC<FooterProps> = ({ onClear, onApply, literals }) => {
  const { isMobile } = useScreen();

  return (
    <div
      data-testid="adelco-filter-menu-footer"
      className="flex justify-between py-2 tablet:py-4 gap-2 tablet:gap-4"
    >
      <Button
        onClick={onClear}
        variant="tertiary"
        size={isMobile ? 'md' : 'sm'}
        block
      >
        {literals.cleanButton}
      </Button>
      <Button
        onClick={onApply}
        variant="secondary"
        size={isMobile ? 'md' : 'sm'}
        block
      >
        {literals.applyButton}
      </Button>
    </div>
  );
};

export default Footer;
