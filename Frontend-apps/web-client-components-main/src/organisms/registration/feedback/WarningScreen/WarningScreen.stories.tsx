import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import WarningScreen from './WarningScreen';
import { Button } from '../../../../uikit/actions';

export default {
  title:
    'Organisms/Registration/Feedback/Warning Screen/Generic Warning Screen',
  component: WarningScreen,
  decorators: [withDesign]
} as ComponentMeta<typeof WarningScreen>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-142615&t=oUl2PuwTQY1rPHtu-4'
  }
};

const Template: ComponentStory<typeof WarningScreen> = (args) => (
  <WarningScreen {...args} />
);

export const Story = Template.bind({});
Story.storyName = 'Generic Warning Screen';
Story.parameters = { layout: 'fullscreen', ...designParameters };
Story.args = {
  variant: 'error',
  title:
    'Este es el título de la pantalla de error, puede ser texto o un componente',
  children: (
    <div className="flex flex-col gap-6">
      <p>
        Este es el texto de la pantalla de error, puede ser texto o un
        componente
      </p>
      <Button size="sm" variant="tertiary">
        Entendido
      </Button>
    </div>
  )
};
