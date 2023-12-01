import { CTAttribute, FlatAttribute } from '@Types/adelco/product';

export const flatAttributesByName = (
  ctAttributes: CTAttribute[]
): FlatAttribute => {
  return ctAttributes.reduce(
    (acc, attribute) => ({ ...acc, [attribute.name]: attribute.value }),
    {}
  );
};
