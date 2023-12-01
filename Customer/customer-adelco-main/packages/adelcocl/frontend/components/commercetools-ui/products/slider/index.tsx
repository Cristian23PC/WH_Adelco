import React from 'react';
import { Product } from '@Types/product/Product';
import Slider, { SliderProps } from 'components/commercetools-ui/slider';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import { ReferenceLink, Reference } from 'helpers/reference';
import { mobile, tablet, desktop } from 'helpers/utils/screensizes';
import Tile from './tile';

export interface Props {
  products: Product[];
  title: string;
  subline?: string;
  ctaLabel: string;
  ctaLink: Reference;
}

export default function ProductSlider({
  products,
  title,
  subline,
  ctaLabel,
  ctaLink
}: Props) {
  const [isMobileSize] = useMediaQuery(mobile);
  const [isTabletSize] = useMediaQuery(tablet);
  const [isDesktopSize] = useMediaQuery(desktop);

  const sliderFixedMood: SliderProps = {
    slidesPerView: isMobileSize
      ? isTabletSize
        ? isDesktopSize
          ? 4
          : 3
        : 2
      : 1,
    arrows: isMobileSize ? true : false,
    dots: isMobileSize ? false : true
  };

  const sliderConfiguration: SliderProps = sliderFixedMood;

  return (
    <div className="lg:mx-auto lg:max-w-7xl py-4">
      <div className="w-auto text-center">
        <h2 className="dark:text-light-100 text-xl tracking-tight text-gray-400">
          {subline}
        </h2>
        <h2 className="dark:text-light-100 mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
      </div>
      {ctaLabel && ctaLink && (
        <div className="sm:px-6 lg:px-0 flex items-center justify-end px-4">
          <ReferenceLink
            target={ctaLink}
            className="text-accent-400 sm:block hidden text-sm font-semibold"
          >
            {ctaLabel}
            <span aria-hidden="true"> &rarr;</span>
          </ReferenceLink>
        </div>
      )}
      <div className="relative mt-8">
        <div className="relative -mb-6 w-full overflow-x-auto pb-6">
          <Slider {...sliderConfiguration}>
            {products.slice(0, 15).map((product, index: number) => (
              <Tile {...product} key={index} />
            ))}
          </Slider>
        </div>
      </div>

      {ctaLabel && ctaLink && (
        <div className="sm:hidden mt-12 flex px-4">
          <ReferenceLink
            target={ctaLink}
            className="text-accent-400 hover:text-accent-500 text-sm font-semibold"
          >
            {ctaLabel}
            <span aria-hidden="true"> &rarr;</span>
          </ReferenceLink>
        </div>
      )}
    </div>
  );
}
