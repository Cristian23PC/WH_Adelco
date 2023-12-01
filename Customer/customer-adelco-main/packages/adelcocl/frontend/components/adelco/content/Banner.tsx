/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Image from 'frontastic/lib/image';
import classNames from 'classnames';

type slide = {
  image: any;
  bannerLink: string;
};

export interface BannerProps {
  slides: slide[];
  variant: 'primary' | 'secondary';
}

const Banner: React.FC<BannerProps> = ({ slides, variant }) => {
  const [current, setCurrent] = useState(0);
  const [autoPlay] = useState(true);

  const filteredSlides = slides.filter(
    (slide) => slide.image && slide.bannerLink
  );

  const previousSlide = () => {
    if (current === 0) setCurrent(filteredSlides.length - 1);
    else setCurrent(current - 1);
  };

  const nextSlide = () => {
    if (current === filteredSlides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  useEffect(() => {
    let interval;

    if (autoPlay) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [autoPlay, current]);

  return (
    <div
      className={classNames(
        { 'w-[100%]': variant === 'primary' },
        {
          'm-auto px-4 py-4 text-center tablet:px-6 desktop:max-w-[886px] desktop:px-0':
            variant === 'secondary'
        }
      )}
    >
      <div className="relative overflow-hidden  pb-8">
        <div
          className={`flex transition duration-500 ease-out`}
          style={{
            transform: `translateX(-${current * 100}%)`
          }}
        >
          {filteredSlides.map((slide, index) => {
            const { image, bannerLink } = slide;
            return (
              <div key={index} className="min-w-full">
                <a href={bannerLink} rel="noopener noreferrer" target="_blank">
                  <Image
                    media={image.media ? image.media : { media: '' }}
                    src={!image.media ? image : ''}
                    className={classNames('cursor-pointer', {
                      'rounded-2xl': variant === 'secondary'
                    })} //
                    alt=""
                  />
                </a>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 flex w-full justify-center gap-3 py-4">
          {filteredSlides.map((slide, index) => {
            return (
              <div
                onClick={() => {
                  setCurrent(index);
                }}
                key={'circle' + index}
                className={`h-[4px] w-[16px] cursor-pointer rounded-full   ${
                  index == current ? 'bg-[#FCE300]' : 'bg-[#F3F4F9] '
                }`}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Banner;
