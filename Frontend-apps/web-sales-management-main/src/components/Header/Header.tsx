'use client';

import { FC, ReactNode } from 'react';
import { Button, SearchField, SearchFieldProps } from '@adelco/web-components';

export interface HeaderProps extends Partial<SearchFieldProps> {
  headerLabel: string;
  ctaLabel?: string;
  ctaOnClick?: VoidFunction;
  endElement?: ReactNode;
}

const Header: FC<HeaderProps> = ({
  headerLabel,
  ctaLabel,
  ctaOnClick,
  placeholder,
  endElement = null,
  onSearch
}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-8 rounded-2xl bg-white p-4">
      <p className="w-[300px] font-bold text-sm">{headerLabel}</p>
      {onSearch && (
        <div className="grow bg-corporative-01-hover">
          <SearchField placeholder={placeholder} onSearch={onSearch} />
        </div>
      )}
      {ctaLabel && ctaOnClick && (
        <Button size="sm" onClick={ctaOnClick} className="ml-4 my-1">
          {ctaLabel}
        </Button>
      )}
      {endElement}
    </div>
  );
};

export default Header;
