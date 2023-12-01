import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import ThankYouScreen from './ThankYouScreen';

export default {
  title: 'Organisms/Cart/Checkout/Thank You Screen',
  component: ThankYouScreen,
  decorators: [withDesign],
  argTypes: {
    literals: {
      table: {
        control: { type: 'object' },
        defaultValue: {
          summary: JSON.stringify({
            title: '¡Gracias por elegir Adelco!',
            text: 'Tu pedido se está procesando, te enviaremos un correo de confirmación.',
            buttonLabel: 'Aceptar'
          })
        }
      }
    },
    link: {
      table: { defaultValue: { summary: '/' } }
    },
    'data-testid': {
      table: { defaultValue: { summary: 'adelco-thank-you-page' } }
    }
  }
} as ComponentMeta<typeof ThankYouScreen>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=10625-427059&mode=design&t=Oo20RRkOKc7DqXKo-0'
  }
};

const Template: ComponentStory<typeof ThankYouScreen> = (args) => {
  return (
    <div className="max-w-[288px] m-auto">
      <ThankYouScreen {...args} />
    </div>
  );
};
export const ModalStory = Template.bind({});
ModalStory.storyName = 'ThankYouScreen';
ModalStory.args = {
  linkRenderer: (link, label, target) => (
    <a data-testid="link-rendered" href={link} target={target}>
      {label}
    </a>
  )
};
ModalStory.parameters = { layout: 'fullscreen', ...designParameters };
