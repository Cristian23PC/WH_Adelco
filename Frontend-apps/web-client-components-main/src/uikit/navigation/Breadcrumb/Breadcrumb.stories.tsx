import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Breadcrumb from './Breadcrumb';

export default {
  title: 'Ui Kit/Navigation/Breadcrumb',
  component: Breadcrumb,
  decorators: [withDesign]
} as ComponentMeta<typeof Breadcrumb>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1063-2805&t=bDlw46acS36rL7C2-4'
  }
};

const Template: ComponentStory<typeof Breadcrumb> = (args) => {
  return (
    <Breadcrumb
      elements={[
        { label: 'Label 1', url: '#' },
        { label: 'Label 2', url: '#' },
        { label: 'Label 3', url: '#' },
        { label: 'Label 4', url: '#' }
      ]}
    />
  );
};
export const Default = Template.bind({});
Default.storyName = 'Breadcrumb';
Default.args = {};
Default.parameters = designParameters;
