import { FC, useState } from 'react';
import { CodeValidationForm, toast } from '@adelco/web-components';
import { Values, STEPS } from '../useStep';
import useCodeResend from 'frontastic/actions/adelco/user/useCodeResend/useCodeResend';
import useCodeValidation from 'frontastic/actions/adelco/user/useCodeValidation/useCodeValidation';

interface CodeValidationProps {
  values: Values;
  onChangeStep: (step: string, values?: Values) => void;
}

const CodeValidation: FC<CodeValidationProps> = ({ values, onChangeStep }) => {
  const { trigger: codeResend } = useCodeResend();
  const { trigger: validateCode } = useCodeValidation();
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (code: string) => {
    const { statusCode, data } = await validateCode({
      username: values.email,
      code
    });

    if (statusCode >= 400) {
      if (data?.remainingAttempts) {
        setErrorMessage(
          data?.remainingAttempts > 1
            ? `Usted ha introducido un código inválido. Le quedan ${data?.remainingAttempts} intentos.`
            : `Usted ha introducido un código inválido. Le queda ${data?.remainingAttempts} intento.`
        );
      } else {
        setErrorMessage('Has excedido el número de intentos.');
      }
    } else if (statusCode === 200) {
      onChangeStep(STEPS.RESET_PASSWORD, { email: values.email, code });
    } else {
      toast.error({
        text: 'Error inesperado',
        position: 'top-right'
      });
    }
    setAttemptsLeft(data?.remainingAttempts);
  };

  const handleResend = async () => {
    await codeResend({
      username: values.email
    });
    setErrorMessage(undefined);
  };

  return (
    <CodeValidationForm
      emailAddress={values.email}
      onSubmit={handleSubmit}
      onResend={handleResend}
      onRequestNewCode={handleResend}
      errorMessage={errorMessage}
      limitExceeded={attemptsLeft === 0}
    />
  );
};

export default CodeValidation;
