import { type Coordinates } from '../../../../../utils/types';
import { type FormValues } from '../types';
import { type FieldErrors } from 'react-hook-form';

export const handleErrors = (
  errors: FieldErrors<FormValues>,
  field: keyof FormValues
): { variant: 'failure' | 'none'; helperText: string | undefined } => ({
  variant: errors[field] ? 'failure' : 'none',
  helperText: errors[field]?.message
});

const googleMapsApiKey: string | undefined =
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const defaultPosition = {
  lat: -33.4372,
  long: -70.6506
};

export const getCoordinates = async (
  address: string,
  apiKey: string | undefined = googleMapsApiKey
): Promise<Coordinates> => {
  try {
    if (apiKey === undefined) {
      return defaultPosition;
    }
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
    );
    const jsonData = await response.json();

    return {
      lat: jsonData.results[0].geometry.location.lat,
      long: jsonData.results[0].geometry.location.lng
    };
  } catch (error) {
    throw new Error('Failed to fetch coordinates');
  }
};
