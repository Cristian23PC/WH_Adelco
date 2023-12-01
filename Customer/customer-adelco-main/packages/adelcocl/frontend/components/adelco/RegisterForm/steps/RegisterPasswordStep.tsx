import { FC } from 'react';
import { UserEmailPasswordForm } from '@adelco/web-components';
import usePreRegister from 'frontastic/actions/adelco/user/usePreRegister';
import { STEPS, Values } from '../useStep';

interface RegisterPasswordStepProps {
  values: Values;
  onChangeStep: (step: string, values?: Values) => void;
}

const RegisterPasswordStep: FC<RegisterPasswordStepProps> = ({
  values,
  onChangeStep
}) => {
  const { trigger: preRegister } = usePreRegister();

  const handleSubmit = async ({
    firstName,
    phone,
    password,
    rut,
    username,
    surname
  }: Values) => {
    const res = await preRegister({
      firstName,
      phone,
      password,
      rut,
      username,
      lastName: surname
    });

    if (res.status === 200 && !res.body.code) {
      onChangeStep(STEPS['CODE_VALIDATION'], { ...values, password });
    } else {
      onChangeStep(STEPS[res.body.code], { ...values, password });
    }
  };

  return (
    <UserEmailPasswordForm
      onBack={() => onChangeStep(STEPS.HOME)}
      onSubmit={handleSubmit}
      defaultValues={values}
    />
  );
};

export default RegisterPasswordStep;
