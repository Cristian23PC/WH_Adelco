import { IVA_ILA, TaxProfile, ctCalculatePrice } from '@adelco/price-calc';

const convertProduct = (product, t2zoneValue = null, taxProfile: TaxProfile = IVA_ILA, useT2Rate = true) => {
  const calculatedProductPrices = t2zoneValue
    ? ctCalculatePrice({
        product,
        t2Rate: parseFloat(t2zoneValue.t2Rate),
        taxProfile,
        useT2Rate
      })
    : undefined;

  const convertedProduct = {
    ...product,
    ...calculatedProductPrices,
    masterVariant: {
      ...product.masterVariant,
      ...calculatedProductPrices?.masterVariant,
      price: undefined
    },
    taxCategory: undefined
  };

  convertedProduct.variants = convertedProduct.variants?.map(variant => ({ ...variant, price: undefined }));

  return convertedProduct;
};

export { convertProduct };
