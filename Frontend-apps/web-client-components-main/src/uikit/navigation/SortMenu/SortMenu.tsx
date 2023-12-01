import React, { type FC } from 'react';
import { OffCanvas } from '../../structure';
import { Button } from '../../actions';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import Footer from './partials/Footer';
import Options from './partials/Options';
import { type Option } from './types';
import { defaultLiterals } from './mocks';

export interface SortMenuProps {
  title: string;
  open: boolean;
  sortList: Option[];
  selectedValue?: string;
  onClose: VoidFunction;
  onApply: VoidFunction;
  onSelect: (option: string) => void;
  literals?: { [key in keyof typeof defaultLiterals]: string };
}
const SortMenu: FC<SortMenuProps> = ({
  title,
  open,
  sortList,
  selectedValue,
  onClose,
  onApply,
  onSelect,
  literals = defaultLiterals
}) => {
  const { isMobile } = useScreen();

  const customLiterals = {
    ...defaultLiterals,
    ...literals
  };
  return (
    <OffCanvas
      show={open}
      data-testid="adelco-filter-menu"
      placement="right"
      onClose={onClose}
      className="px-4 flex flex-col w-[286px] tablet:w-[300px]"
    >
      <div className="flex justify-between items-center py-2 mb-2 tablet:mb-[20px] overflow-hidden text-base tablet:text-lg font-bold shrink-0">
        <span className="whitespace-normal">{title}</span>
        <Button
          data-testid="adelco-filter-menu-close"
          className="shrink-0"
          variant="tertiary"
          iconName="close"
          size={isMobile ? 'md' : 'sm'}
          onClick={onClose}
        />
      </div>

      <div className="text-corporative-03 pb-2 overflow-auto">
        <Options
          sortList={sortList}
          onSelect={onSelect}
          selectedValue={selectedValue}
        />
      </div>

      <Footer literals={customLiterals} onApply={onApply} />
    </OffCanvas>
  );
};

export default SortMenu;
