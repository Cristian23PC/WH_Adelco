import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import BusinessInformationForm from './BusinessInformationForm';
import mockRegions from '../../../ZoneModal/regions.example.json';
import mockCommunes from '../../../ZoneModal/communes.example.json';
import mockLocalities from '../../../ZoneModal/localities.example.json';
import { linkRendererMock } from '../../../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';

export default {
  title: 'Organisms/Registration/Forms/Business - Step 1 - InformationForm',
  component: BusinessInformationForm
} as ComponentMeta<typeof BusinessInformationForm>;

const mockSteps = [
  { title: 'Información de negocios', step: 1 },
  { title: 'Información de facturación', step: 2 },
  { title: 'Confirmación', step: 3 }
];

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-143023&t=SgNLkyDqG1ceXgvt-0'
  }
};

const Template: ComponentStory<typeof BusinessInformationForm> = (args) => {
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
    <div className="tablet:w-[442px] desktop:w-[468px] tablet:m-auto">
      <BusinessInformationForm
        {...args}
        onRegionChange={handleRegionChange}
        onCommuneChange={handleCommuneChange}
        localityList={localities}
        regionList={regions}
        communeList={communes}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.storyName = 'Business - Step 1 - InformationForm';

Default.args = {
  steps: mockSteps,
  RUT: '76.392.099-7',
  socialReason: 'El Rincón del Huaso',
  linkRenderer: linkRendererMock,
  leaveRegisterLink: '#',
  onSubmit: async (values) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(values);
      }, 3000)
    );
  }
};
