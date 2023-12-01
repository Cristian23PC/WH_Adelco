import { IPrices } from './interfaces/prices';

export const validate = (values: Partial<IPrices>) => {
  const errors: Partial<IPrices> = {};

  if (!values.distributionChannel) {
    errors.distributionChannel = 'Campo requerido';
  }

  return errors;
};
