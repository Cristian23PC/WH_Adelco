import React from 'react';
import classNames from 'classnames';
import FilterNoResultsImage from './resources/FilterNoResultsImage';

const DEFAULT_LITERALS = {
  title: 'No hay resultados para mostrar.',
  textButton: 'Revisa los filtros aplicados'
};

export interface FilterNoResultsProps {
  'data-testid'?: string;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]?: string };
  className?: string;
  onClick?: VoidFunction;
}

const FilterNoResults: React.FC<FilterNoResultsProps> = ({
  'data-testid': dataTestId = 'adelco-filter-no-results',
  literals,
  className,
  onClick
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div
      data-testid={dataTestId}
      className={classNames('grid gap-y-6 text-center mt-8 mb-4', className)}
    >
      <FilterNoResultsImage className="m-auto" />
      <div>
        <p className="font-body font-normal text-base text-corporative-03 text-center">
          {l.title}
        </p>
        <span
          className={classNames('text-base font-bold text-center', {
            'underline hover:cursor-pointer': onClick
          })}
          onClick={onClick}
        >
          {l.textButton}
        </span>
      </div>
    </div>
  );
};

export default FilterNoResults;
