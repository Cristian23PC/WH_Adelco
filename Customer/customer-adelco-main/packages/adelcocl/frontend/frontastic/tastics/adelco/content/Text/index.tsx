import React from 'react';
import Text from 'components/adelco/content/Text/Text';

const TextTastic = ({ data }) => {
  const { variant, align, hidden, description } = data;
  return (
    <Text
      variant={variant}
      align={align}
      hidden={hidden}
      description={description}
    />
  );
};

export default TextTastic;
