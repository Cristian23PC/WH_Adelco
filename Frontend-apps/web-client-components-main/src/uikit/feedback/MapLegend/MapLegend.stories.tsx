import React from 'react';
import { type Story, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import MapLegend, { type MapLegendProps } from './MapLegend';

export default {
  title: 'UI Kit/Feedback/MapLegend',
  component: MapLegend,
  decorators: [withDesign]
} as ComponentMeta<typeof MapLegend>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/J1KIL9QYoFafGo20Cu14yY/Management-Website?node-id=3663%3A106663&mode=dev'
  }
};

const Template: Story<MapLegendProps> = (args) => (
  <div className="p-6">
    <div className="w-52">
      <MapLegend {...args} />
    </div>
  </div>
);

export const Display = Template.bind({});
Display.storyName = 'Map Legend';
Display.args = {
  title: 'Visualización',
  items: [
    { color: '#FCE300', label: 'Lunes' },
    { color: '#FF964A', label: 'Martes' },
    { color: '#FB3E3E', label: 'Miércoles' },
    { color: '#5AC648', label: 'Jueves' },
    { color: '#3E96E8', label: 'Viernes' },
    { color: '#CCCCCC', label: 'Sin visita', className: 'mt-3' }
  ]
};
Display.parameters = {
  ...designParameters,
  layout: 'fullscreen',
  backgrounds: { default: 'Snow' }
};
