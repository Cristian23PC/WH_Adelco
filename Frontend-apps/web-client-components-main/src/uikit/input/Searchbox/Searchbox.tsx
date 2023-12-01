import React, {
  useState,
  useEffect,
  useCallback,
  type InputHTMLAttributes,
  useRef,
  forwardRef,
  type RefObject
} from 'react';
import classNames from 'classnames';
import { SearchFlyout } from './SearchFlyout';
import { Icon } from '../../feedback/Icon';
import { debounce } from '../../../utils/debounce';
import useClickOutside from '../../../utils/hooks/useClickOutside';
import { Button } from '../../actions';
import useScreen from '../../../utils/hooks/useScreen';

export interface SearchboxProps extends InputHTMLAttributes<HTMLInputElement> {
  'data-testid'?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  lastSearched?: string[];
  suggestionList?: string[];
  flyoutTitle?: string;
  flyoutOpen?: boolean;
  onSearch: (param: string) => void;
  onClose?: () => void;
  onTypeSearch: (param: string) => void;
  onFlyoutOpen?: () => void;
  onFlyoutClose?: () => void;
}

const Searchbox = forwardRef<HTMLDivElement, SearchboxProps>(
  (
    {
      'data-testid': dataTestId = 'adelco-searchbox',
      className,
      placeholder,
      value,
      lastSearched = [],
      suggestionList = [],
      flyoutTitle,
      onSearch,
      onClose,
      onTypeSearch,
      onFlyoutOpen = () => {},
      onFlyoutClose = () => {},
      flyoutOpen = false
    },
    menuIconRef
  ) => {
    const { isMobile } = useScreen();
    const inputRef = useRef<HTMLInputElement>(null);
    const flyoutRef = useRef(null);
    useClickOutside(
      [flyoutRef, inputRef, menuIconRef as RefObject<HTMLDivElement>],
      () => {
        handleOnFlyoutClose();
      },
      flyoutOpen
    );
    const [query, setQuery] = useState(value != null ? value : '');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [suggestions, setSuggestions] = useState(
      suggestionList.length > 0 ? suggestionList : lastSearched
    );

    const isQueryEmpty = query === '';

    useEffect(() => {
      setQuery(value ?? '');
    }, [value]);

    useEffect(() => {
      if (query.length === 0 && lastSearched?.length > 0) {
        setSuggestions(lastSearched);
      }

      const debouncedFn = debounce(() => {
        setDebouncedQuery(query);
      }, 300);

      debouncedFn();

      return () => {
        debouncedFn.cancel();
      };
    }, [query, lastSearched]);

    useEffect(() => {
      if (debouncedQuery.length >= 3) {
        onTypeSearch(debouncedQuery);
      }
    }, [debouncedQuery, onTypeSearch]);

    useEffect(() => {
      if (suggestionList.length > 0) {
        setSuggestions(suggestionList);
      } else if (lastSearched?.length > 0) {
        setSuggestions(lastSearched);
      }
    }, [suggestionList, lastSearched]);

    const changeBodyScroll = (disable: boolean): void => {
      document.body.classList.toggle('searchbox-open', disable);
    };

    useEffect(() => {
      changeBodyScroll(flyoutOpen);

      return () => {
        flyoutOpen && changeBodyScroll(false);
      };
    }, [flyoutOpen]);

    const handleOnFocus = (): void => {
      if (suggestions.length > 0) {
        onFlyoutOpen();
      }
    };

    const handleOnFlyoutClose = (): void => {
      onFlyoutClose();
      inputRef?.current?.blur?.();
    };

    const handleSuggestionClick = useCallback(
      (suggestion: string) => {
        setQuery(suggestion);
        setDebouncedQuery(suggestion);
        onSearch(suggestion);
        handleOnFlyoutClose();
      },
      [onSearch]
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.target;
      setQuery(value);
      if (value.length === 0 && lastSearched.length > 0) {
        setSuggestions(lastSearched);
      }
    };

    const handleClose = useCallback(() => {
      handleOnFlyoutClose();
      setQuery('');
      onClose?.();
    }, []);

    const handleSearchClick = (): void => {
      onSearch(debouncedQuery);
    };

    const handleSubmit = (e: React.SyntheticEvent): void => {
      e.preventDefault();
      onSearch(query);
      handleOnFlyoutClose();
    };

    const textColor =
      query.length > 0 ? 'text-corporative-02' : 'text-corporative-02-hover';

    return (
      <div className="relative w-full">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              ref={inputRef}
              data-testid={dataTestId}
              className={classNames(
                'w-full relative z-50',
                'h-8 tablet:h-11',
                'p-2 tablet:py-3 tablet:pl-6',
                {
                  'pr-8 tablet:pr-10': isQueryEmpty,
                  'pr-14 tablet:pr-20 font-bold': !isQueryEmpty
                },
                'text-xs tablet:text-sm font-sans text-ellipsis',
                'border-0 bg-snow rounded-full',
                'focus:border-0 focus:outline-0 focus-visible:outline-0 focus-visible:border-0',
                'focus:placeholder-opacity-0 focus-visible:placeholder-opacity-0',
                'focus:shadow-lg',
                textColor,
                className
              )}
              type="text"
              value={query}
              placeholder={placeholder}
              onFocus={handleOnFocus}
              onChange={handleChange}
            />
            <div
              className={classNames(
                'absolute top-1/2 -translate-y-1/2 right-2 z-50',
                'flex justify-center items-center'
              )}
            >
              <div
                className={classNames('flex items-center gap-2 tablet:gap-4')}
              >
                <Icon
                  name="close"
                  width={isMobile ? 24 : 36}
                  height={isMobile ? 24 : 36}
                  onClick={handleClose}
                  className={classNames(
                    'text-corporative-02 transition-all cursor-pointer p-1 tablet:p-2',
                    {
                      hidden: isQueryEmpty
                    }
                  )}
                />
                <div>
                  {isQueryEmpty && (
                    <Icon
                      name="search"
                      width={isMobile ? 24 : 36}
                      height={isMobile ? 24 : 36}
                      className="shrink-0 text-corporative-02 p-1 tablet:p-2"
                      onClick={handleSearchClick}
                    />
                  )}
                  {!isQueryEmpty && (
                    <Button
                      className="shrink-0"
                      variant="secondary"
                      iconName="search"
                      size="xs"
                      onClick={handleSearchClick}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        <SearchFlyout
          ref={flyoutRef}
          className="shadow-lg"
          onClick={handleSuggestionClick}
          suggestionList={suggestions}
          showFlyout={flyoutOpen}
          title={suggestions === lastSearched ? flyoutTitle : undefined}
        />
      </div>
    );
  }
);

Searchbox.displayName = 'Searchbox';
export default Searchbox;
