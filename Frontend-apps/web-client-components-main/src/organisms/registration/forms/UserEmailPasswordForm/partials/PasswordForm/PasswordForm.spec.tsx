import React, { type FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, render, screen, act } from '@testing-library/react';
import PasswordForm, {
  type PasswordFormProps,
  type Values,
  DEFAULT_LITERALS as l
} from './PasswordForm';
import passwordSchema, { DEFAULT_LITERALS as sl } from './passwordSchema';
import { yupResolver } from '@hookform/resolvers/yup';

interface TestPasswordFormProps extends Partial<PasswordFormProps> {
  onSubmit?: (values: Values) => void;
}
const Component: FC<TestPasswordFormProps> = ({ onSubmit = jest.fn() }) => {
  const methods = useForm<Values>({
    resolver: yupResolver(passwordSchema(sl))
  });

  return (
    <FormProvider {...methods}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={methods.handleSubmit((values) => onSubmit(values))}>
        <PasswordForm />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

describe('PasswordForm', () => {
  describe('actions', () => {
    it('should submit with correct values', async () => {
      const onSubmitSpy = jest.fn();
      const password = 'asdfASDF1234$';
      render(<Component onSubmit={onSubmitSpy} />);

      fireEvent.change(screen.getByLabelText(l.passwordLabel), {
        target: { value: password }
      });
      fireEvent.change(screen.getByLabelText(l.confirmPasswordLabel), {
        target: { value: password }
      });
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
      });

      expect(onSubmitSpy).toHaveBeenCalledWith({
        confirmPassword: password,
        password
      });
    });
  });

  describe('errors', () => {
    it('should render required errors', async () => {
      render(<Component />);

      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
      });

      expect(screen.getByText(sl.requiredPassword)).toBeInTheDocument();
      expect(screen.getByText(sl.requiredConfirmPassword)).toBeInTheDocument();
    });

    it('should render not match password error', async () => {
      render(<Component />);

      fireEvent.change(screen.getByLabelText(l.passwordLabel), {
        target: { value: 'asdfASDF1234$' }
      });
      fireEvent.change(screen.getByLabelText(l.confirmPasswordLabel), {
        target: { value: 'asdfASDF1234$$' }
      });
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
      });

      expect(screen.getByText(sl.passwordDontMatch)).toBeInTheDocument();
    });

    it('should render not strong password error', async () => {
      render(<Component />);

      fireEvent.change(screen.getByLabelText(l.passwordLabel), {
        target: { value: 'not-strong' }
      });
      fireEvent.change(screen.getByLabelText(l.confirmPasswordLabel), {
        target: { value: 'not-strong' }
      });
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
      });

      expect(screen.getByText(sl.invalidPassword));
    });
  });
});
