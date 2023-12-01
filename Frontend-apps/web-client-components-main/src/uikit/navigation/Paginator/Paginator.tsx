import React, { useMemo, type FC } from 'react';
import { Button } from '../../actions/Button';
import { getPaginatorElements } from './helpers';
import Page from './Page';

interface NavigationButtonProps {
  direction: 'back' | 'next';
  disabled: boolean;
  onClick: () => void;
}
const NavigationButton: FC<NavigationButtonProps> = ({
  direction,
  onClick,
  disabled
}) => {
  return (
    <>
      <Button
        data-testid={`navigator-btn-mobile-${direction}`}
        variant="secondary"
        className="tablet:hidden"
        size="md"
        onClick={onClick}
        disabled={disabled}
        iconName={`arrow_${direction}`}
      />
      <Button
        data-testid={`navigator-btn-tablet-${direction}`}
        variant="secondary"
        className="hidden tablet:flex"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        iconName={`arrow_${direction}`}
      />
    </>
  );
};

export interface PaginatorProps {
  totalPages: number;
  currentPage: number;
  onClick: (pageToNav: number) => void;
}
const Paginator: FC<PaginatorProps> = ({
  totalPages,
  currentPage,
  onClick
}) => {
  const paginatorElements = useMemo(
    () => getPaginatorElements(totalPages, currentPage),
    [totalPages, currentPage]
  );

  const goToNextPage = (): void => {
    onClick(currentPage + 1);
  };
  const goToPreviousPage = (): void => {
    onClick(currentPage - 1);
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div
      data-testid="paginator"
      className="w-80 desktop:w-[380px] flex justify-evenly"
    >
      <NavigationButton
        direction="back"
        disabled={isFirstPage}
        onClick={goToPreviousPage}
      />
      {paginatorElements.map((element, index) => (
        <Page
          active={element === currentPage}
          pageValue={element}
          onClick={onClick}
          key={index}
        />
      ))}
      <NavigationButton
        direction="next"
        disabled={isLastPage}
        onClick={goToNextPage}
      />
    </div>
  );
};

export default Paginator;
