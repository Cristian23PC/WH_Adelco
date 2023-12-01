import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import FlyoutTooltip from './FlyoutTooltip';

export default {
  title: 'UI Kit/Feedback/FlyoutTooltip',
  component: FlyoutTooltip,
  decorators: [withDesign]
} as ComponentMeta<typeof FlyoutTooltip>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1066-2725&t=QjNUdee0SU3SmMwS-4'
  }
};

const Template: ComponentStory<typeof FlyoutTooltip> = (args) => (
  <FlyoutTooltip {...args} />
);

export const FlyoutTooltipStory = Template.bind({});
FlyoutTooltipStory.storyName = 'Flyout Tooltip';
FlyoutTooltipStory.parameters = designParameters;

FlyoutTooltipStory.args = {
  message: 'Cuéntanos en que zona te encuentras para ver todos los precios.',
  onClick: () => {},
  buttonLabel: 'Ingresar ubicación'
};
