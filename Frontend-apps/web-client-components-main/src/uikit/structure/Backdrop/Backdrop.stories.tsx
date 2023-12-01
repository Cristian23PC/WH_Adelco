import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Backdrop from './Backdrop';
import { FlyoutTooltip } from '../../feedback/FlyoutTooltip';

export default {
  title: 'UI Kit/Structure/Backdrop',
  component: Backdrop,
  decorators: [withDesign]
} as ComponentMeta<typeof Backdrop>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=773-49047&t=X3gWEiWbp7iENr7X-0'
  },
  layout: 'fullscreen'
};

const message =
  'Cuéntanos en que zona te encuentras para ver todos los precios.';

const Template: ComponentStory<typeof Backdrop> = (args) => {
  return (
    <div>
      <img
        src="https://images.pexels.com/photos/2649403/pexels-photo-2649403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="bgexample"
        className="w-full h-full max-h-screen object-fill"
      />
      <Backdrop {...args} />
      <FlyoutTooltip
        message={message}
        className="left-4"
        onClose={() => {}}
        onClick={() => {}}
        buttonLabel="Ingresar Ubicación"
      />
    </div>
  );
};

export const BackdropStory = Template.bind({});
BackdropStory.parameters = designParameters;
BackdropStory.storyName = 'Backdrop';
