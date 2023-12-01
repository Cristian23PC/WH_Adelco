import React from 'react';
import classNames from 'classnames';

export interface NoResultsProps {
  'data-testid'?: string;
  className?: string;
  onClick: VoidFunction;
  searchedTerm: string;
}

const NoResults: React.FC<NoResultsProps> = ({
  'data-testid': dataTestId = 'adelco-no-results',
  className,
  onClick,
  searchedTerm
}) => {
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'w-full flex flex-col items-center',
        'mt-16 tablet:mt-14',
        className
      )}
    >
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 56.8619L43.24 40.1019C47.2675 35.2668 49.2759 29.0651 48.8474 22.7869C48.4188 16.5086 45.5863 10.6374 40.9391 6.39437C36.2919 2.15138 30.1878 -0.136631 23.8966 0.00631647C17.6054 0.149264 11.6115 2.71216 7.16185 7.16185C2.71216 11.6115 0.149264 17.6054 0.00631647 23.8966C-0.136631 30.1878 2.15138 36.2919 6.39437 40.9391C10.6374 45.5863 16.5086 48.4188 22.7869 48.8474C29.0651 49.2759 35.2668 47.2675 40.1019 43.24L56.8619 60L60 56.8619ZM4.51793 24.4915C4.51793 20.5411 5.68936 16.6794 7.88408 13.3948C10.0788 10.1101 13.1982 7.55007 16.8479 6.03832C20.4976 4.52657 24.5136 4.13103 28.3881 4.90171C32.2626 5.6724 35.8216 7.57469 38.6149 10.368C41.4083 13.1614 43.3106 16.7203 44.0812 20.5948C44.8519 24.4693 44.4564 28.4853 42.9446 32.135C41.4329 35.7847 38.8728 38.9042 35.5882 41.0989C32.3035 43.2936 28.4419 44.465 24.4915 44.465C19.196 44.4591 14.119 42.3529 10.3745 38.6084C6.63004 34.8639 4.5238 29.787 4.51793 24.4915Z"
          fill="#1D1D1B"
        />
        <path
          d="M31 31L18 18M18 31L31 18"
          stroke="#FCE300"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3
        className={classNames(
          'mt-1.5 tablet:mt-6',
          'font-title font-bold text-xl tablet:text-2xl',
          'text-corporative-02'
        )}
      >
        Lo sentimos
      </h3>
      <p
        className={classNames(
          'mt-1 tablet:mt-1.5 text-center',
          'font-normal font-sans',
          'text-base, tablet:text-lg',
          'text-corporative-03'
        )}
      >
        Buscamos &quot;
        <span className="text-corporative-02 font-bold">{searchedTerm}</span>
        &quot; y no lo encontramos.
        <br />
        Te sugerimos volver a{' '}
        <span
          className="font-bold underline hover:cursor-pointer"
          onClick={onClick}
        >
          Buscar
        </span>
        .
      </p>
    </div>
  );
};

export default NoResults;
