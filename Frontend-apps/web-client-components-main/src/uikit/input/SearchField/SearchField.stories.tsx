import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import SearchField from './SearchField';

export default {
  title: 'UI Kit/Input/SearchField',
  component: SearchField,
  decorators: [withDesign]
} as ComponentMeta<typeof SearchField>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=1621-369623&t=oQtw0zOut9TGhXrG-0'
  }
};

const Template: ComponentStory<typeof SearchField> = (args) => {
  return (
    <div className="relative w-full tablet:w-[255px] desktop:w-[437px] p-4 z-40">
      <SearchField {...args} />
    </div>
  );
};

export const SearchboxStory = Template.bind({});
SearchboxStory.storyName = 'SearchField';
SearchboxStory.parameters = { layout: 'fullscreen', ...designParameters };
SearchboxStory.args = {
  onSearch: (param) => {
    console.log('buscando => ', param);
  },
  placeholder:
    'Buscar cliente por ID, nombre de negocio, vendedor o nombre de territorio...'
};
