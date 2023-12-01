/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import classNames from 'classnames';

export interface TextBannerProps {
  title: string;
  text: string;
  variant: 'primary' | 'secondary';
}

const TextBanner: React.FC<TextBannerProps> = ({ title, text, variant }) => {
  return (
    <div className="m-auto p-4 text-center tablet:px-6 desktop:max-w-[886px] desktop:px-0">
      {variant === 'primary' && <h1 className="text-lg font-bold">{title}</h1>}
      {variant === 'secondary' && (
        <h2 className="text-sm font-bold">{title}</h2>
      )}
      <p
        className={classNames(
          'mt-4 text-moon',
          { 'text-md': variant === 'primary' },
          { 'text-xs': variant === 'secondary' }
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default TextBanner;
