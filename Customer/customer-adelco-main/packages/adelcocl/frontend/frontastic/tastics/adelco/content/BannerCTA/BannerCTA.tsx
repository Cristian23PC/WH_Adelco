import React from 'react';
import Banner from 'components/adelco/content/BannerCTA';

const BannerTastic = ({ data }) => {
  return (
    <Banner
      image={data.image}
      title={data.title}
      subtitle={data.subtitle}
      ctaLabel={data.ctaLabel}
      ctaLink={data.ctaLink}
    />
  );
};

export default BannerTastic;
