import { DeliveryAddressFormFormatedValues } from '@Types/adelco/businessUnits';
import { Values } from './useStep';

export const formatAddDeliveryAddress = ({
  localName,
  region,
  commune,
  street,
  streetNumber = '',
  apartment = '',
  additionalInformation = '',
  coordinates,
  firstName,
  surname,
  username,
  phone,
  locality = ''
}: Values): DeliveryAddressFormFormatedValues => ({
  tradeName: localName,
  address: {
    country: 'CL',
    region,
    commune,
    city: locality,
    streetName: street,
    streetNumber,
    apartment,
    otherInformation: additionalInformation,
    coordinates: coordinates
  },
  contactInfo: {
    email: username,
    firstName,
    lastName: surname,
    phone
  }
});
