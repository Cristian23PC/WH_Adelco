/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Image from 'frontastic/lib/image';
import classNames from 'classnames';

export const gridClasses = [
  '',
  'grid-cols-1',
  'grid-cols-2',
  'grid-cols-3',
  'grid-cols-4'
];

type slide = {
  image: any;
  bannerLink: string;
};

export interface BannerProps {
  slides: slide[];
}

const BannerGrid: React.FC<BannerProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [autoPlay] = useState(true);

  const filteredSlides = slides.filter(
    (slide) => slide.image && slide.bannerLink
  );

  return (
    <ul
      className={classNames(
        'm-auto grid gap-4 p-4 text-center tablet:px-6 desktop:max-w-[886px] desktop:px-0',
        gridClasses[filteredSlides.length]
      )}
    >
      {filteredSlides.map((slide, index) => {
        const { image, bannerLink } = slide;
        return (
          <li key={index}>
            <a href={bannerLink} rel="noopener noreferrer" target="_blank">
              <Image
                media={image.media ? image.media : { media: '' }}
                src={!image.media ? image : ''}
                className="cursor-pointer rounded-2xl"
                alt=""
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default BannerGrid;
