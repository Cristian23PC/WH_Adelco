import classNames from 'classnames';
import React, { type FC } from 'react';

interface CategoryItemProps {
  title: string;
  count: number;
  active: boolean;
}
const CategoryItem: FC<CategoryItemProps> = ({ title, count, active }) => {
  return (
    <div
      className={classNames('cursor-pointer font-normal', {
        'text-corporative-02 underline font-semibold': active,
        'text-corporative-02-hover': !active
      })}
    >
      {title} ({count})
    </div>
  );
};

export default CategoryItem;
