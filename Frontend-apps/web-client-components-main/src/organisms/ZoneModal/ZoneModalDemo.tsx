import React, { useState, useEffect, type FC } from 'react';
import ZoneModal, { type Props } from './ZoneModal';
import type { OptionObject } from '../../uikit/input/Dropdown/Dropdown';
import type { Values } from './partials/ZoneModalContent';
import regions from './regions.example.json';
import communes from './communes.example.json';
import localities from './localities.example.json';

const ZoneModalDemo: FC<Props> = (props) => {
  const regionOptions = regions.map((reg) => ({
    value: reg.key,
    label: reg.label
  }));

  const [communeOptions, setCommuneOptions] = useState<OptionObject[]>([]);
  const [localityOptions, setLocalityOptions] = useState<OptionObject[]>([]);
  const [values, setValues] = useState<Values>({
    region: undefined,
    commune: undefined,
    locality: undefined
  });

  useEffect(() => {
    if (values.region != null) {
      const list = communes.filter((com) => com.region === values.region);
      setCommuneOptions(
        list.map((com) => ({ value: com.key, label: com.label }))
      );
    }
  }, [values.region]);

  useEffect(() => {
    if (values.commune != null) {
      const list = localities.filter((loc) => loc.commune === values.commune);
      setLocalityOptions(
        list.map((loc) => ({ value: loc.key, label: loc.label }))
      );
    }
  }, [values.commune]);

  const handleRegionChange = (data: string): void => {
    if (data !== values.region) {
      setValues((prevState: Values) => ({
        ...prevState,
        region: data,
        commune: undefined,
        locality: undefined
      }));
      setCommuneOptions([]);
      setLocalityOptions([]);
    }
  };

  const handleCommuneChange = (data: string): void => {
    if (data !== values.commune) {
      setValues((prevState: Values) => ({
        ...prevState,
        commune: data,
        locality: undefined
      }));
      setLocalityOptions([]);
    }
  };

  const handleLocalityChange = (data: string): void => {
    if (data !== values.locality) {
      setValues((prevState: Values) => ({ ...prevState, locality: data }));
    }
  };

  const cleanValues = (): void => {
    setValues(() => ({
      region: undefined,
      commune: undefined,
      locality: undefined
    }));
    setCommuneOptions([]);
    setLocalityOptions([]);
  };

  return (
    <ZoneModal
      {...props}
      regionOptions={regionOptions}
      onRegionChange={handleRegionChange}
      communeOptions={communeOptions}
      onCommuneChange={handleCommuneChange}
      localityOptions={localityOptions}
      onLocalityChange={handleLocalityChange}
      values={values}
      onSubmit={(data) => {
        console.log('data: ', data);
      }}
      onClose={() => {
        cleanValues();
        props.onClose();
      }}
    />
  );
};

export default ZoneModalDemo;
