import React from 'react';
import { type Story, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import { Tooltip, type TooltipProps } from './Tooltip';
import { Button } from '../../actions';

export default {
  title: 'UI Kit/Feedback/Tooltip',
  component: Tooltip,
  decorators: [withDesign]
} as ComponentMeta<typeof Tooltip>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=18497-388612&mode=design&t=DlyGEDAzlHsDC6tN-4'
  }
};

const Template: Story<TooltipProps> = (args) => (
  <div className="my-12 mx-48">
    <Tooltip {...args}>
      <Button variant="secondary" size="sm">
        Tooltip
      </Button>
    </Tooltip>
  </div>
);

export const Display = Template.bind({});
Display.storyName = 'Tooltip';
Display.args = {
  open: true,
  text: 'Tooltip text info'
};
Display.parameters = designParameters;

export const TooltipOnHover = Template.bind({});
TooltipOnHover.storyName = 'Tooltip On Hover';
TooltipOnHover.args = {
  text: 'Tooltip text info'
};
TooltipOnHover.parameters = designParameters;
