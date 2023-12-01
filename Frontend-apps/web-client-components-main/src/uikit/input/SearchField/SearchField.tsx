import React, { useState, useCallback, type InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import { Icon } from '../../feedback/Icon';
import { Button } from '../../actions';

export interface SearchFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  'data-testid'?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onSearch: (param: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
  'data-testid': dataTestId = 'adelco-searchfield',
  className,
  placeholder,
  value,
  onSearch
}) => {
  const [query, setQuery] = useState(value != null ? value : '');

  const isQueryEmpty = query === '';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setQuery(value);
  };

  const handleClose = useCallback(() => {
    setQuery('');
    onSearch('');
  }, []);

  const handleSearchClick = (): void => {
    onSearch(query);
  };

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    onSearch(query);
  };

  const textColor =
    query.length > 0 ? 'text-corporative-02' : 'text-corporative-02-hover';

  return (
    <>
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div className="px-4 tablet:px-0 py-2.5 tablet:py-0">
            <input
              data-testid={dataTestId}
              className={classNames(
                'w-full relative z-10',
                'h-12 tablet:h-11',
                'pl-2 tablet:pl-4',
                {
                  'pr-20 tablet:pr-28': !isQueryEmpty,
                  'pr-14': isQueryEmpty
                },
                'bg-snow rounded-md',
                'border-0 font-sans',
                'focus:border-0 focus:outline-0 focus-visible:outline-0 focus-visible:border-0',
                'text-sm rounded-md',
                'focus:placeholder-opacity-0 focus-visible:placeholder-opacity-0',
                'focus:shadow-lg',
                {
                  'font-bold': !isQueryEmpty
                },
                textColor,
                className
              )}
              type="text"
              value={query}
              placeholder={placeholder}
              onChange={handleChange}
            />
            <div
              className={classNames(
                'absolute top-[18px] tablet:top-1 right-10 tablet:right-8 z-10',
                'w-8 tablet:w-9 h-8 tablet:h-9',
                'flex justify-center items-center'
              )}
            >
              <div
                className={classNames('flex items-center', {
                  'gap-4 tablet:gap-6': !isQueryEmpty,
                  'gap-6': isQueryEmpty
                })}
              >
                <Icon
                  name="close"
                  width={20}
                  height={20}
                  onClick={handleClose}
                  className={classNames('text-corporative-02 transition-all', {
                    'opacity-0': isQueryEmpty,
                    'opacity-100': !isQueryEmpty,
                    'cursor-pointer': !isQueryEmpty,
                    'cursor-auto': isQueryEmpty
                  })}
                />
                <div className="mr-3 tablet:mr-6">
                  {isQueryEmpty && (
                    <Icon
                      name="search"
                      width={20}
                      height={20}
                      className="shrink-0 text-corporative-02"
                      onClick={handleSearchClick}
                    />
                  )}
                  {!isQueryEmpty && (
                    <Button
                      className="shrink-0 -mr-2"
                      variant="secondary"
                      iconName="search"
                      size={'sm'}
                      onClick={handleSearchClick}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchField;
