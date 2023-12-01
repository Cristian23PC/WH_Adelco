import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import Footer from './Footer';
import footerPropsMock from './FooterProps.mock';

export default {
  title: 'Ui Kit/Navigation/Footer',
  component: Footer
} as ComponentMeta<typeof Footer>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1072-2761&t=2g9Ry6gk0lqZwoZN-4'
  }
};

const Template: ComponentStory<typeof Footer> = (args) => {
  return <Footer {...args} />;
};

export const Default = Template.bind({});
Default.args = footerPropsMock;
Default.parameters = designParameters;
Default.storyName = 'Footer';
