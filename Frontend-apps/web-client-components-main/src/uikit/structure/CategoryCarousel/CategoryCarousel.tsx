import React, { useRef } from 'react';
import classNames from 'classnames';
import ProductCard, { type ProductCardProps } from '../ProductCard/ProductCard';
import { Link } from '../../actions';
import { type IconName, type LinkRenderer } from '../../../utils/types';
import useDragToScroll from '../../../utils/hooks/useDragToScroll';

export interface CategoryCarouselProps {
  'data-testid'?: string;
  title?: string;
  linkButton?: {
    label: string;
    url: string;
    icon: IconName;
    linkRenderer: LinkRenderer;
  };
  products: ProductCardProps[];
  className?: string;
  onClick?: (slug: string | undefined) => void;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  'data-testid': dataTestId = 'adelco-carrousel',
  title = '',
  linkButton,
  products = [],
  className = '',
  onClick = () => undefined
}) => {
  const slider = useRef<HTMLDivElement>(null);
  const {
    isScrollActive,
    dragStyleClasses,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave
  } = useDragToScroll(slider);

  const hasLinkButton = linkButton !== undefined;

  return (
    <div
      className={classNames(
        'desktop:max-w-[886px] px-4 tablet:px-6 desktop:px-0 pb-2 tablet:pb-5 m-auto',
        className
      )}
      data-testid={dataTestId}
    >
      <div className="flex py-4 gap-2">
        <h2
          className="text-corporative-02 font-bold tablet:text-lg"
          style={{ wordBreak: 'break-word' }}
        >
          {title}
        </h2>
        <span className="ml-auto flex leading-[18px] whitespace-nowrap mt-[3px]">
          {hasLinkButton && (
            <Link
              url={linkButton.url}
              linkRenderer={linkButton.linkRenderer}
              iconName={linkButton.icon}
            >
              {linkButton.label}
            </Link>
          )}
        </span>
      </div>
      <div
        className={classNames(
          dragStyleClasses,
          'overflow-x-scroll scrollbar-hide'
        )}
        ref={slider}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div
          className={classNames(
            'grid',
            'grid-cols-5',
            'gap-4 desktop:gap-2 min-w-[774px]'
          )}
        >
          {products.map((product) => {
            return (
              <ProductCard
                key={product.slug}
                {...product}
                className={classNames(
                  { 'hover:cursor-grabbing': isScrollActive },

                  'cursor-grabbing min-w-[136px] tablet:min-w-[146px] desktop:min-w-[171px]'
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
