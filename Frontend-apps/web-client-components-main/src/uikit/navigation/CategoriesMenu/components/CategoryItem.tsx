import React, { type FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../../../feedback/Icon';
import { type MenuItem } from '../types';
import { type LinkRenderer } from '../../../../utils/types';

interface CategoryItemProps {
  item: MenuItem;
  onClick?: VoidFunction;
  linkRenderer: LinkRenderer;
  active?: boolean;
}
const CategoryItem: FC<CategoryItemProps> = ({
  item,
  onClick,
  linkRenderer,
  active = false
}) => {
  const hasChildren = item.children !== undefined && item.children.length > 0;

  const content = (
    <li
      data-testid={`category-item-${item.title}`}
      key={item.title}
      className={classNames(
        'flex justify-between items-center py-2 px-4 tablet:px-6 gap-2 text-sm hover:bg-snow leading-[19px] h-10',
        { 'font-bold bg-corporative-01-hover': active }
      )}
      onClick={onClick}
      role="button"
    >
      <span className="whitespace-normal line-clamp-2 w-full">
        {item.title}
      </span>
      {hasChildren && <Icon name="arrow_s_right" width={24} height={24} />}
    </li>
  );

  return (
    <>
      {!hasChildren && item.slug !== undefined
        ? linkRenderer(item.slug, content)
        : content}
    </>
  );
};

export default CategoryItem;
