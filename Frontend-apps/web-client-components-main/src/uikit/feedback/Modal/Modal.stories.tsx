import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Modal from './Modal';
import { Button } from '../../actions';
import { TextField } from '../../input';

export default {
  title: 'UI Kit/Feedback/Modal',
  component: Modal,
  decorators: [withDesign]
} as ComponentMeta<typeof Modal>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1141-3861&t=n6EjHkTtFyVaisuq-0'
  }
};

const Template: ComponentStory<typeof Modal> = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        variant="secondary"
        className="m-4"
      >
        Open Modal
      </Button>
      <Modal
        {...args}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
};

const modalBody = (
  <div className="w-[300px]">
    <p className="font-semibold pb-12">
      Ingresar por Zona para ver nuestros Precios
    </p>
    <p>Contenido ejemplo</p>
  </div>
);

export const ModalStory = Template.bind({});
ModalStory.storyName = 'Modal';
ModalStory.args = {
  open: false,
  children: modalBody,
  onClose: () => {
    console.log('calling close action outside the component.');
  },
  className: undefined,
  backdropClassName: undefined,
  bodyClassName: 'h-72',
  showLogo: true
};
ModalStory.parameters = { layout: 'fullscreen', ...designParameters };

const modalBody2 = (
  <div className="w-[500px] flex flex-col gap-y-6">
    <p className="font-semibold text-base">Eliminar territorio</p>
    <p className="text-sm">
      Si se elimina este territorio, la acción no se podrá deshacer.
    </p>
    <div className="flex flex-row gap-x-3 justify-center">
      <Button variant="tertiary" size="sm">
        Mantener
      </Button>
      <Button variant="secondary" size="sm">
        Eliminar
      </Button>
    </div>
  </div>
);

export const ModalStory2 = Template.bind({});
ModalStory2.storyName = 'Modal - MW Confirm Example';
ModalStory2.args = {
  open: false,
  children: modalBody2,
  onClose: () => {
    console.log('calling close action outside the component.');
  },
  className: undefined,
  backdropClassName: undefined
};
ModalStory2.parameters = { layout: 'fullscreen', ...designParameters };
const modalBody3 = (
  <div className="w-[500px] flex flex-col gap-y-4">
    <p className="font-semibold text-base">Información de territorio</p>
    <ul className="border-[1px] rounded-lg">
      <li className="border-b-[1px] text-left p-2">
        <p className="font-semibold text-xs">ID</p>
        <p className="text-xs">0045</p>
      </li>
      <li className="text-left p-2">
        <p className="font-semibold text-xs">Clientes asignados</p>
        <p className="text-xs">0</p>
      </li>
    </ul>
    <p className="font-semibold text-base">Nombre de territorio</p>
    <TextField placeholder="Nombre de Territorio" />
    <p className="font-semibold text-base">Vendedor</p>
    <TextField placeholder="Vendedor" />
    <p className="font-semibold text-base">Area Supervisada</p>
    <TextField placeholder="Área supervisada" />
    <p className="font-semibold text-base">Descripción</p>
    <div className="bg-snow w-full h-[132px] rounded-xl"></div>
    <p className="font-semibold text-sm underline">Eliminar territorio</p>
  </div>
);

export const ModalStory3 = Template.bind({});
ModalStory3.storyName = 'Modal - MW View Example';
ModalStory3.args = {
  open: false,
  children: modalBody3,
  onClose: () => {
    console.log('calling close action outside the component.');
  },
  className: undefined,
  backdropClassName: undefined
};
ModalStory3.parameters = { layout: 'fullscreen', ...designParameters };
