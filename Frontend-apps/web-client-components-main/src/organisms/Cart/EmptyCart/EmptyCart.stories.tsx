import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import EmptyCart from './EmptyCart';
export default {
  title: 'Organisms/Cart/Empty Cart',
  component: EmptyCart,
  decorators: [withDesign]
} as ComponentMeta<typeof EmptyCart>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=2130-196277&t=46orEhFONYshWbcr-0'
  }
};

const Template: ComponentStory<typeof EmptyCart> = (args) => {
  return (
    <div className="max-w-[266px] m-auto">
      <EmptyCart linkRenderer={args.linkRenderer} />
    </div>
  );
};
export const ModalStory = Template.bind({});
ModalStory.storyName = 'EmptyCart';
ModalStory.args = {
  linkRenderer: (link, label, target) => (
    <a data-testid="link-rendered" href={link} target={target}>
      {label}
    </a>
  )
};
ModalStory.parameters = { layout: 'fullscreen', ...designParameters };
