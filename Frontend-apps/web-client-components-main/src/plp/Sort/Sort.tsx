import React, { type FC } from 'react';
import SortDropdown, {
  type SortDropdownProps
} from '../../uikit/navigation/SortDropdown/SortDropdown';
import SortMenu, {
  type SortMenuProps
} from '../../uikit/navigation/SortMenu/SortMenu';
import useScreen from '../../utils/hooks/useScreen/useScreen';

type UnionSortProps = SortDropdownProps & SortMenuProps;
export interface SortProps extends Omit<UnionSortProps, 'onApply'> {
  onApply: (option: string) => void;
}
const Sort: FC<SortProps> = ({ onApply, ...props }) => {
  const { isDesktop } = useScreen();

  const handleApply = (): void => {
    onApply(props.selectedValue ?? '');
  };

  const handleChangeSort = (option: string): void => {
    props.onSelect(option);
    onApply(option);
  };

  return (
    <>
      {isDesktop && <SortDropdown {...props} onSelect={handleChangeSort} />}
      {!isDesktop && <SortMenu {...props} onApply={handleApply} />}
    </>
  );
};

export default Sort;
