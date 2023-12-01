import classNames from 'classnames';
import React, { type FC } from 'react';
import { ELLIPSIS, type PageElement } from './helpers';

interface PageProps {
  pageValue: PageElement;
  active?: boolean;
  onClick: (pageToNav: number) => void;
}
const Page: FC<PageProps> = ({ pageValue, onClick, active }: PageProps) => {
  const handleClick = (): void => {
    if (pageValue !== ELLIPSIS) {
      onClick(pageValue);
    }
  };
  const pageClasses = classNames(
    'w-9 h-9 rounded-full flex justify-center items-center',
    {
      'cursor-pointer': pageValue !== ELLIPSIS,
      'bg-snow': active
    }
  );
  return (
    <div
      data-testid={`page-${pageValue}`}
      className={pageClasses}
      onClick={handleClick}
    >
      {pageValue}
    </div>
  );
};

export default Page;
