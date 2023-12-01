import useStep, { STEPS } from './useStep';
import ResetRequest from './steps/ResetRequestStep';
import CodeValidation from './steps/CodeValidationStep';
import ResetPasswordStep from './steps/ResetPasswordStep';

const ResetPassword = () => {
  const { step, onChangeStep, values } = useStep();

  const stepComponents = {
    [STEPS.RESET_REQUEST]: <ResetRequest onChangeStep={onChangeStep} />,
    [STEPS.CODE_VALIDATION]: (
      <CodeValidation values={values} onChangeStep={onChangeStep} />
    ),
    [STEPS.RESET_PASSWORD]: <ResetPasswordStep values={values} />
  };

  if (!stepComponents[step]) {
    throw new Error(`Step "${step}" not found`);
  }

  return stepComponents[step];
};

export default ResetPassword;
