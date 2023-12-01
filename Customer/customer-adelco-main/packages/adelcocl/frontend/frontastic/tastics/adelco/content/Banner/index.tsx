import Banner from 'components/adelco/content/Banner';
import React from 'react';

const BannerTastic = ({ data }) => {
  const {
    image1,
    image2,
    image3,
    image4,
    bannerLink1,
    bannerLink2,
    bannerLink3,
    bannerLink4,
    variant
  } = data;

  let slides = [
    { image: image1, bannerLink: bannerLink1 },
    { image: image2, bannerLink: bannerLink2 },
    { image: image3, bannerLink: bannerLink3 },
    { image: image4, bannerLink: bannerLink4 }
  ];

  return <Banner slides={slides} variant={variant} />;
};

export default BannerTastic;
