import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import UnableCreateAccountScreen from './UnableCreateAccountScreen';
import { linkRendererMock } from '../../../../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';

export default {
  title:
    'Organisms/Registration/Feedback/Warning Screen/Unable Create Account Screen',
  component: UnableCreateAccountScreen,
  decorators: [withDesign]
} as ComponentMeta<typeof UnableCreateAccountScreen>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-142615&t=oUl2PuwTQY1rPHtu-4'
  }
};

const Template: ComponentStory<typeof UnableCreateAccountScreen> = (args) => (
  <UnableCreateAccountScreen {...args} />
);

export const Story = Template.bind({});
Story.storyName = 'Unable Create Account Screen';
Story.parameters = { layout: 'fullscreen', ...designParameters };
Story.args = {
  onTryAgain: console.log,
  linkRenderer: linkRendererMock,
  callCenter: '600 600 6363',
  whatsAppLink:
    'https://api.whatsapp.com/send?phone=+56989310375&text=%C2%A1Hola!%20Necesito%20asistencia%20para%20comprar%20en%20el%20sitio%20de%20Adelco.%20Mi%20nombre%20es%20%7BNOMBRE+APELLIDO%7D%20y%20el%20RUT%20de%20mi%20empresa%20%7BRUT%20EMPRESA%7D.%20Mi%20correo%20de%20contacto%20es%20%7BCORREO%7D'
};
