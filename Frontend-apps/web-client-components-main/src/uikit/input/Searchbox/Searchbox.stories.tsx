import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Searchbox from './Searchbox';

export default {
  title: 'UI Kit/Input/Searchbox',
  component: Searchbox,
  decorators: [withDesign]
} as ComponentMeta<typeof Searchbox>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=1621-369623&t=oQtw0zOut9TGhXrG-0'
  }
};

const Template: ComponentStory<typeof Searchbox> = (args) => {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  return (
    <div className="relative w-full tablet:w-[255px] desktop:w-[437px] p-4 z-40">
      <Searchbox
        {...args}
        onFlyoutClose={() => {
          setFlyoutOpen(false);
        }}
        onFlyoutOpen={() => {
          setFlyoutOpen(true);
        }}
        flyoutOpen={flyoutOpen}
        ref={null}
      />
    </div>
  );
};

export const SearchboxStory = Template.bind({});
SearchboxStory.storyName = 'Searchbox';
SearchboxStory.parameters = { layout: 'fullscreen', ...designParameters };
SearchboxStory.args = {
  lastSearched: ['Durex', 'Mate', 'Agua Mineral'],
  onSearch: (param) => {
    console.log('buscando => ', param);
  },
  onTypeSearch: (param) => {
    console.log('buscando sugerencias para:', param);
  },
  placeholder: 'Busca en Adelco.cl',
  suggestionList: [],
  flyoutTitle: 'Búsquedas recientes'
};
