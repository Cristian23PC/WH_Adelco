import TextBanner from 'components/adelco/content/TextBanner';
import React from 'react';

const TextBannerTastic = ({ data }) => {
  const { title, text, variant } = data;
  return <TextBanner title={title} text={text} variant={variant} />;
};

export default TextBannerTastic;
