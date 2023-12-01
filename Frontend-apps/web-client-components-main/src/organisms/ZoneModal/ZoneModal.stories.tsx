import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import ZoneModalDemo from './ZoneModalDemo';
import type ZoneModal from './ZoneModal';
import HomeTemplate from '../../utils/HomeTemplate';

export default {
  title: 'Organisms/ZoneModal',
  component: ZoneModalDemo,
  decorators: [withDesign]
} as ComponentMeta<typeof ZoneModal>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=835-68272&t=ZqaHGE9hI6lhQnXS-4'
  }
};

const Template: ComponentStory<typeof ZoneModal> = (args) => (
  <ZoneModalDemo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true
};
Default.parameters = { ...designParameters, layout: 'fullscreen' };

const HomeExampleTemplate: ComponentStory<typeof ZoneModal> = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <HomeTemplate>
      <ZoneModalDemo
        {...args}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <div className="pt-8 text-center font-bold">
        Press tooltip to open the modal
      </div>
    </HomeTemplate>
  );
};

export const HomeExample = HomeExampleTemplate.bind({});
HomeExample.parameters = { layout: 'fullscreen' };
