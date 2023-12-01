import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import CodeValidationForm from './CodeValidationForm';

export default {
  title: 'Organisms/Registration/Forms/User - 3 - Code Validation',
  component: CodeValidationForm
} as ComponentMeta<typeof CodeValidationForm>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-141785&t=wdI8UNGxPWTWKAOV-0'
  }
};

const Template: ComponentStory<typeof CodeValidationForm> = (args) => {
  const MAX_ATTEMPTS = 3;
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
  const [attempt, setAttempt] = React.useState(1);
  const validCode = '9137';
  const onSubmit = (code: string): void => {
    if (code === validCode) {
      setErrorMessage(undefined);
    } else {
      if (attempt >= MAX_ATTEMPTS) {
        setErrorMessage('Excediste el número de intentos.');
      } else {
        const attemptsLeft = MAX_ATTEMPTS - attempt;

        setErrorMessage(
          attemptsLeft > 1
            ? `Usted ha introducido un código inválido. Te quedan ${attemptsLeft} intentos.`
            : `Usted ha introducido un código inválido. Te queda ${attemptsLeft} intento.`
        );
      }
    }
    setAttempt(attempt + 1);
  };

  const onRequestNewCode = (): void => {
    setErrorMessage(undefined);
    setAttempt(1);
  };

  const onResend = (): void => {
    // TODO resend code
  };

  return (
    <div className="p-4 m-auto tablet:max-w-[300px]">
      <CodeValidationForm
        {...args}
        errorMessage={errorMessage}
        onSubmit={onSubmit}
        limitExceeded={attempt > MAX_ATTEMPTS}
        onRequestNewCode={onRequestNewCode}
        onResend={onResend}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.storyName = 'User - 3 - Code Validation';
Default.args = {
  emailAddress: 'email@adelco.cl',
  onSubmit: console.log
};
