import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import BillingAddressForm from './BillingAddressForm';
import mockRegions from '../../../ZoneModal/regions.example.json';
import mockCommunes from '../../../ZoneModal/communes.example.json';
import mockLocalities from '../../../ZoneModal/localities.example.json';

export default {
  title: 'Organisms/Registration/Forms/Business - Step 2 - BillingAddressForm',
  component: BillingAddressForm
} as ComponentMeta<typeof BillingAddressForm>;

const mockSteps = [
  { title: 'Información de negocios', step: 1, isComplete: true },
  { title: 'Información de facturación', step: 2 },
  { title: 'Confirmación', step: 3 }
];

const businessAddressValues = {
  RUT: 'RUT EXAMPLE',
  socialReason: 'Social Reason example',
  localName: 'Localname Example',
  coordinates: { lat: 45, long: 45 },
  region: 'de-antofagasta',
  commune: 'maria-elena',
  locality: 'locality-1',
  street: 'Street Example',
  streetNumber: '34',
  apartment: '5',
  additionalInformation: 'Some extra info'
};

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-143116&t=otAnNOt8egXmkCay-4'
  }
};

const Template: ComponentStory<typeof BillingAddressForm> = (args) => {
  const [regions] = useState(
    mockRegions.map((r) => ({ value: r.key, label: r.label }))
  );

  const getCommunesFromRegion = (
    region: string
  ): Array<{ value: string; label: string }> => {
    return mockCommunes
      .filter((commune) => commune.region === region)
      .map((c) => ({ value: c.key, label: c.label }));
  };

  const getLocalitiesFromCommune = (
    commune: string
  ): Array<{ value: string; label: string }> => {
    return mockLocalities
      .filter((locality) => locality.commune === commune)
      .map((l) => ({ value: l.key, label: l.label }));
  };

  const [communes, setCommunes] = useState(getCommunesFromRegion(''));
  const [localities, setLocalities] = useState(getLocalitiesFromCommune(''));

  const handleRegionChange = (region: string): void => {
    const newCommune = getCommunesFromRegion(region);
    setCommunes(newCommune);
    setLocalities([]);
  };

  const handleCommuneChange = (commune: string): void => {
    setLocalities(getLocalitiesFromCommune(commune));
  };

  return (
    <div className="tablet:w-[390px] desktop:w-[600px] tablet:m-auto">
      <BillingAddressForm
        {...args}
        onRegionChange={handleRegionChange}
        regionList={regions}
        communeList={communes}
        onCommuneChange={handleCommuneChange}
        localityList={localities}
        businessAddressValues={businessAddressValues}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.args = {
  steps: mockSteps,
  onSubmit: async (values) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        // resolve(values);
      }, 3000)
    );
  }
};
