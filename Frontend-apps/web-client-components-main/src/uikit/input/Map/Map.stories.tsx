import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import MapComponent from './Map';
import type { Coordinates } from '../../../utils/types';
export default {
  title: 'Ui Kit/Input/Map',
  component: MapComponent,
  decorators: [withDesign]
} as ComponentMeta<typeof MapComponent>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=2192-5110&t=imtyJQvwrvLzr0IN-4'
  }
};

const Template: ComponentStory<typeof MapComponent> = (args) => (
  <MapComponent
    {...args}
    className="h-[200px] tablet:h-[176.6px]"
    coordinates={{
      lat: -33.4372,
      long: -70.6506
    }}
    onDragEnd={({ lat, long }: Coordinates): void => {
      console.log('onDragEnd', lat, long);
    }}
  />
);

export const Map = Template.bind({});
Map.parameters = designParameters;
