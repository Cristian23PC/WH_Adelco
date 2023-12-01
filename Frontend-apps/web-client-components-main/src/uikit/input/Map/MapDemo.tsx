import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, TextField } from '../../../uikit';
import type { Coordinates } from '../../../utils/types';
import Map from './Map';

const googleMapsApiKey: string | undefined =
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const defaultPosition = {
  lat: -33.4372,
  long: -70.6506
};

const MapDemoComponent: React.FC = () => {
  const [direction, setDirection] = useState('');
  const [hasAddress, setHasAddress] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultPosition);

  const getCoordinates = async (address: string): Promise<Coordinates> => {
    try {
      if (typeof googleMapsApiKey !== 'string') return defaultPosition;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`
      );

      const jsonData = await response.json();
      return {
        lat: jsonData.results[0].geometry.location.lat,
        long: jsonData.results[0].geometry.location.lng
      };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch coordinates');
    }
  };
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setDirection(value);
  };

  const handleOnSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (direction === '') {
      setHasAddress(false);
      return;
    }
    try {
      const coord = await getCoordinates(direction);
      setCoordinates(coord);
      setHasAddress(true);
    } catch (error) {
      console.error(error);
      // handle error here
    }
  };

  const handleOnDragEnd = (coord: Coordinates): void => {
    setCoordinates(coord);
  };

  return (
    <div>
      <form
        className="flex flex-col items-center gap-4 tablet:gap-8 grow mb-6"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleOnSubmit}
      >
        <div className="flex w-full flex-col gap-2 tablet:gap-4">
          <TextField
            name="direction"
            value={direction}
            onChange={handleOnChange}
            placeholder="Please type an address"
          />
          <Button
            className="my-4 tablet:my-0"
            variant="tertiary"
            iconName="place"
            type="submit"
          >
            Confirmar
          </Button>
        </div>
      </form>

      {hasAddress && (
        <>
          Coordinates: <br /> lat:{coordinates.lat} <br />
          lng: {coordinates.long}
          <Map
            className="mt-6 h-[200px] tablet:h-[176.6px]"
            markerLabel="Tienda"
            coordinates={coordinates}
            onDragEnd={handleOnDragEnd}
          />
        </>
      )}
    </div>
  );
};

export default MapDemoComponent;
