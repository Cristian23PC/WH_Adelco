import classNames from 'classnames';
import { type FC } from 'react';
import React from 'react';

interface CategoryMenuContainerProps {
  children: React.ReactNode;
  open: boolean;
  className?: string;
  'data-testid'?: string;
}
const CategoryMenuContainer: FC<CategoryMenuContainerProps> = ({
  children,
  open,
  className,
  'data-testid': dataTestId = 'adelco-category-menu-container'
}) => {
  const position = open ? 'left-0' : '-left-[110%]';

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'w-screen tablet:max-w-[430px] absolute top-0 max-h-screen h-screen overflow-hidden z-50 bg-white duration-300 drop-shadow-sm-right',
        position,
        className
      )}
    >
      {children}
    </div>
  );
};

export default CategoryMenuContainer;
