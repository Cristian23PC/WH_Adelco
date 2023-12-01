import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import SortDropdown from './SortDropdown';

export default {
  title: 'UI Kit/Navigation/SortDropdown',
  component: SortDropdown,
  decorators: [withDesign]
} as ComponentMeta<typeof SortDropdown>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=898-1774&mode=design&t=2pXJIUflZhocuFRx-4'
  }
};

const mockOptions = [
  { label: 'Recomendados', value: 'recomendados' },
  { label: 'Mas vendido', value: 'mas-vendido' },
  { label: 'Mejor descuento', value: 'mejor-descuento' },
  { label: 'A-Z', value: 'A-Z' },
  { label: 'Z-A', value: 'Z-A' }
];

const Template: ComponentStory<typeof SortDropdown> = (args) => {
  const [selectedValue, setSelectedValue] = React.useState('');

  return (
    <SortDropdown
      {...args}
      sortList={mockOptions}
      onSelect={setSelectedValue}
      selectedValue={selectedValue}
    />
  );
};

export const Default = Template.bind({});
Default.storyName = 'Sort Dropdown';
Default.parameters = designParameters;
Default.args = {};
