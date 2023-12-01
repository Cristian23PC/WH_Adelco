import React, { type FC } from 'react';
import { Button } from '../../../../../uikit/actions';
import Map from '../../../../../uikit/input/Map/Map';
import { type Coordinates } from '../../../../../utils/types';
import useScreen from '../../../../../utils/hooks/useScreen/useScreen';
import { type FormValues } from '../types';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import { defaultPosition, getCoordinates } from './utils';

export const DEFAULT_LITERALS = {
  placeConfirmationLabel: 'Nos falta solo confirmar tu ubicación',
  placeConfirmationButtonLabel: 'Confirma aquí'
};

interface MapFormProps {
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
  mapApiKey?: string;
}
const MapForm: FC<MapFormProps> = ({ literals, mapApiKey }) => {
  const { setValue, getValues, watch } = useFormContext<FormValues>();

  const { isMobile } = useScreen();
  const coordinates = watch('coordinates');

  const handleConfirmLocation = (): void => {
    const address = `${getValues('street')} ${
      getValues('streetNumber') ?? ''
    }, ${getValues('commune')}, ${getValues('region')}`;
    getCoordinates(address, mapApiKey)
      .then((coordinates) => {
        setValue('coordinates', coordinates);
      })
      .catch((error) => {
        setValue('coordinates', defaultPosition);
        console.error(error);
      });
  };

  return (
    <>
      <p className="pt-2 text-center text-sm desktop:my-2">
        {literals.placeConfirmationLabel}
      </p>
      <Button
        onClick={handleConfirmLocation}
        iconName="place"
        variant="tertiary"
        size={isMobile ? 'md' : 'sm'}
      >
        {literals.placeConfirmationButtonLabel}
      </Button>
      <Map
        className={classNames('w-full desktop:mt-2 transition-all', {
          'h-0': !coordinates,
          'h-[200px]': coordinates
        })}
        onDragEnd={({ lat, long }: Coordinates): void => {
          setValue('coordinates', { lat, long });
        }}
        coordinates={coordinates}
        apiKey={mapApiKey}
      />
    </>
  );
};

export default MapForm;
