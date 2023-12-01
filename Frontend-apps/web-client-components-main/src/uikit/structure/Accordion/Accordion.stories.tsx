import React, { useEffect, useState } from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import Accordion from './Accordion';

export default {
  title: 'Ui Kit/Structure/Accordion',
  component: Accordion
} as ComponentMeta<typeof Accordion>;

const mockChildren = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Nulla f
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Nulla f
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Nulla f
`;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1202-5614&t=kGvb3Kyp4Sq1aYCW-4'
  }
};

const Template: ComponentStory<typeof Accordion> = (args) => {
  const [isOpen, setIsOpen] = useState(args.open);

  useEffect(() => {
    setIsOpen(args.open);
  }, [args.open]);

  const toggleOpen = (): void => {
    setIsOpen(!isOpen);
  };

  return <Accordion {...args} open={isOpen} onClick={toggleOpen} />;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Accordion Title',
  open: false,
  children: mockChildren
};
Default.parameters = designParameters;
Default.storyName = 'Accordion';

export const LimitedWidth = Template.bind({});
LimitedWidth.args = {
  title: 'Accordion Title',
  open: false,
  children: mockChildren,
  className: 'w-72'
};
LimitedWidth.parameters = designParameters;
LimitedWidth.storyName = 'Accordion with limited width';
