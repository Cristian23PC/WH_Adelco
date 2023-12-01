import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import DeliveryAddressForm from './DeliveryAddressForm';
import mockRegions from '../../../ZoneModal/regions.example.json';
import mockCommunes from '../../../ZoneModal/communes.example.json';
import mockLocalities from '../../../ZoneModal/localities.example.json';

export default {
  title:
    'Organisms/Delivery Address/Forms/Delivery Address - Step 1 - DeliveryAddressForm',
  component: DeliveryAddressForm
} as ComponentMeta<typeof DeliveryAddressForm>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=11368-671944&mode=design&t=07SxKzISb9FSvRyX-0'
  }
};

const Template: ComponentStory<typeof DeliveryAddressForm> = (args) => {
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
    <DeliveryAddressForm
      {...args}
      onRegionChange={handleRegionChange}
      onCommuneChange={handleCommuneChange}
      localityList={localities}
      regionList={regions}
      communeList={communes}
    />
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.storyName = 'Delivery Address - Step 1 - DeliveryAddressForm';

Default.args = {
  onSubmit: async (values) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        alert('submit');
        resolve(values);
      }, 3000)
    );
  },
  onBack: () => {
    alert('go back');
  }
};
