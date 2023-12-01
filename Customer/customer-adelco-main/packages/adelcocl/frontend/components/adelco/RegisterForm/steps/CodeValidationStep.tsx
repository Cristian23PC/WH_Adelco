import { FC, useState } from 'react';
import { CodeValidationForm, toast } from '@adelco/web-components';
import useLogin from 'frontastic/actions/adelco/user/useLogin/useLogin';
import useRegister from 'frontastic/actions/adelco/user/useRegister/useRegister';
import { Values, STEPS } from '../useStep';
import useCodeResend from 'frontastic/actions/adelco/user/useCodeResend/useCodeResend';

interface CodeValidationStepProps {
  values: Values;
  onChangeStep: (step: string, values?: Values) => void;
}
const CodeValidationStep: FC<CodeValidationStepProps> = ({
  values,
  onChangeStep
}) => {
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const { trigger: register } = useRegister();
  const { trigger: codeResend } = useCodeResend();
  const { trigger: login } = useLogin();

  const handleSubmit = async (code: string) => {
    const res = await register({ username: values.username, code });
    const data = res.body;

    if (!data.code && data.id) {
      const billingAddressId = data.billingAddressIds?.[0];
      const billingAddress = data.addresses?.find(
        (address) => address.id === billingAddressId
      );

      await login({
        username: values.username,
        password: values.password
      });

      if (billingAddress) {
        onChangeStep(STEPS.SUCCESSFUL_REGISTRATION, { billingAddress });
      } else {
        onChangeStep(STEPS.BUSINESS_INFORMATION, { BUInfo: data });
      }
    } else {
      if (data.code === 'BU-011') {
        const attemptsRemaining = data.data.remainingAttempts;
        if (attemptsRemaining === 0) {
          setErrorMessage('Excediste el número de intentos.');
        } else {
          setErrorMessage(
            attemptsRemaining > 1
              ? `Usted ha introducido un código inválido. Te quedan ${attemptsRemaining} intentos.`
              : `Usted ha introducido un código inválido. Te queda ${attemptsRemaining} intento.`
          );
        }
        setAttemptsLeft(attemptsRemaining);
      } else {
        toast.error({
          title: 'Error',
          text: 'Ocurrió un error al validar el código.<br/>Por favor, vuelve a solicitar un código de verificación.',
          position: 'top-right'
        });
      }
    }
  };

  const handleResend = async () => {
    await codeResend({ username: values.username });

    setAttemptsLeft(3);
    setErrorMessage('');
  };

  return (
    <CodeValidationForm
      onSubmit={handleSubmit}
      onRequestNewCode={handleResend}
      errorMessage={errorMessage}
      limitExceeded={attemptsLeft === 0}
      onResend={handleResend}
      emailAddress={values.username}
    />
  );
};

export default CodeValidationStep;
