import React, { type FC } from 'react';
import { Button } from '../../../actions/Button';
import classNames from 'classnames';

interface CategoriesMenuHeaderProps {
  title: string;
  isChildMenu?: boolean;
  onClose: VoidFunction;
  onBack?: VoidFunction;
}
const CategoriesMenuHeader: FC<CategoriesMenuHeaderProps> = ({
  title,
  onClose,
  onBack,
  isChildMenu = false
}) => {
  return (
    <div
      data-testid="adelco-menu-header"
      className={classNames(
        'flex items-center font-bold px-4 py-2 tablet:px-6 tablet:pt-6 tablet:pb-0 gap-2 text-base tablet:text-lg leading-[22px] tablet:leading-[25px]',
        {
          'text-sm tablet:!text-base leading-[19px] desktop:leading-[22px] mb-[1px]':
            isChildMenu
        }
      )}
    >
      {Boolean(onBack) && (
        <Button
          className="tablet:hidden flex-shrink-0"
          variant="tertiary"
          iconName="arrow_back"
          onClick={onBack}
        />
      )}
      <span className="grow whitespace-normal line-clamp-1">{title}</span>
      <Button
        className="tablet:hidden flex-shrink-0"
        variant="tertiary"
        iconName="close"
        onClick={onClose}
      />
    </div>
  );
};

export default CategoriesMenuHeader;
