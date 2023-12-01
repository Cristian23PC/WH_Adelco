import React, { type FC } from 'react';
import { type LinkRenderer } from '../../../../utils/types';
import classNames from 'classnames';

export interface PromotionalBannerProp {
  imageUrl: string;
  link: string;
  linkRenderer: LinkRenderer;
  'data-testid'?: string;
  className?: string;
}

const PromotionalBannerItem: FC<PromotionalBannerProp> = ({
  imageUrl,
  link,
  linkRenderer,
  'data-testid': dataTestId = 'adelco-promotional-banner',
  className
}) => {
  const content = (
    <img
      src={imageUrl}
      alt="banner"
      className="border-0 rounded-none object-cover max-w-[100%]"
    />
  );
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'relative w-full h-[67px] overflow-hidden rounded-2xl',
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
        {linkRenderer(link, content)}
      </div>
    </div>
  );
};

export default PromotionalBannerItem;
