import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import Stepper from './Stepper';

export default {
  title: 'Ui Kit/Navigation/Stepper',
  component: Stepper
} as ComponentMeta<typeof Stepper>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1212-5057&t=syYtWxP24LUlfEKM-4'
  }
};

const Template: ComponentStory<typeof Stepper> = (args) => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <Stepper {...args} currentStep={currentStep} onClick={setCurrentStep} />
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.storyName = 'Stepper';
Default.args = {
  steps: [
    { step: 1, title: 'Etiqueta del Paso en dos filas' },
    { step: 2, title: 'Nombre segundo de la etapa' },
    { step: 3, title: 'Tercer step de la etapa' },
    { step: 4, title: 'Cuarto y ultimo step', isComplete: true }
  ]
};
