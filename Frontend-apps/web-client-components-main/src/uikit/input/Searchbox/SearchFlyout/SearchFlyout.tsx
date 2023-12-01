import React, { forwardRef } from 'react';
import classNames from 'classnames';

export interface SearchFlyoutProps {
  'data-testid'?: string;
  className?: string;
  suggestionList?: string[];
  title?: string;
  onClick: (param: string) => void;
  showFlyout?: boolean;
}

const SearchFlyout = forwardRef<HTMLDivElement, SearchFlyoutProps>(
  (
    {
      'data-testid': dataTestId = 'adelco-search-flyout',
      className,
      onClick,
      suggestionList = [],
      title,
      showFlyout = false
    },
    ref
  ) => {
    if (showFlyout && suggestionList.length > 0) {
      return (
        <div
          data-testid={dataTestId}
          className={classNames(
            'w-full',
            'bg-white text-corporative-02 tablet:rounded-2xl',
            'fixed left-0 right-0 top-[48px] bottom-0 z-30',
            'tablet:absolute tablet:top-full tablet:translate-y-2 tablet:bottom-auto',
            className
          )}
        >
          <div
            ref={ref}
            className={classNames(
              'w-full flex flex-col gap-2 py-4 desktop:py-6 tablet:rounded-2xl'
            )}
          >
            {title != null && (
              <span className="font-bold text-sm px-4 desktop:px-6">
                {title}
              </span>
            )}
            <ul
              className={classNames(
                'flex flex-col gap-2',
                'font-sans text-sm tablet:text-xs',
                'px-4 desktop:px-6',
                'overflow-y-auto scroll-smooth scrollbar-thin tablet:max-h-64'
              )}
            >
              {suggestionList.map((suggestion, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      onClick(suggestion);
                    }}
                    className={classNames(
                      'p-4 tablet:p-2 font-normal',
                      'shadow-list shadow-snow hover:cursor-pointer'
                    )}
                  >
                    {suggestion}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }
);

SearchFlyout.displayName = 'SearchFlyout';

export default SearchFlyout;
