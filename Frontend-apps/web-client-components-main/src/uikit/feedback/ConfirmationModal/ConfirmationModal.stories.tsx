import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import ConfirmationModal, { DEFAULT_LITERALS } from './ConfirmationModal';
import useScreen from '../../../utils/hooks/useScreen/useScreen';

export default {
  title: 'UI Kit/Feedback/Confirmation Modal',
  component: ConfirmationModal,
  decorators: [withDesign]
} as ComponentMeta<typeof ConfirmationModal>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=3307-153797&t=DVDQL8tVcMWJQCuJ-0'
  }
};

const Template: ComponentStory<typeof ConfirmationModal> = (args) => {
  const { isMobile } = useScreen();
  const [modalOpen, setModalOpen] = useState(true);
  return (
    <>
      <ConfirmationModal
        {...args}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onSubmit={() => {
          console.log('Confirmed..');
          setModalOpen(false);
        }}
        isMobile={isMobile}
      />
      <div className="m-5">
        <span
          className="underline font-bold font-sans hover:cursor-pointer"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Vaciar carrito
        </span>
      </div>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  message: '¿Estás seguro de vaciar tu carro?',
  literals: {
    ...DEFAULT_LITERALS,
    confirmButtonLabel: 'Vaciar carro'
  }
};
Default.parameters = { ...designParameters, layout: 'fullscreen' };
Default.storyName = 'Confirmation Modal';
