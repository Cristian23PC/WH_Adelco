import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Logo from './Logo';

export default {
  title: 'Foundation/Logo',
  component: Logo,
  decorators: [withDesign],
  excludeStories: /DefaultLogo/
} as ComponentMeta<typeof Logo>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1154-5272&viewport=3616%2C3616%2C0.03&t=6jP8yqZXk6OO3aRg-0'
  }
};

const Template: ComponentStory<typeof Logo> = (args) => (
  <div
    style={{
      padding: '20px',
      background: args.variant?.includes('white') ? 'black' : 'none'
    }}
  >
    <Logo {...args} />
  </div>
);

export const CorporativeLogo = Template.bind({});
CorporativeLogo.args = {
  variant: 'corporative'
};
CorporativeLogo.parameters = designParameters;

export const WhiteLogo = Template.bind({});
WhiteLogo.args = {
  variant: 'white'
};
WhiteLogo.parameters = designParameters;

export const BlackLogo = Template.bind({});
BlackLogo.args = {
  variant: 'black'
};
BlackLogo.parameters = designParameters;

export const WhiteIsotype = Template.bind({});
WhiteIsotype.args = {
  variant: 'white-isotype'
};
WhiteIsotype.parameters = designParameters;

export const BlackIsotype = Template.bind({});
BlackIsotype.args = {
  variant: 'black-isotype'
};
BlackIsotype.parameters = designParameters;

export const CorporativeIsotype = Template.bind({});
CorporativeIsotype.args = {
  variant: 'corporative-isotype'
};
CorporativeIsotype.parameters = designParameters;
