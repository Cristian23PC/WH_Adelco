import React, { type FC } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import loginSchema, { DEFAULT_LITERALS as dl } from './loginSchema';
import LoginForm, {
  type LoginFormProps,
  type Values,
  DEFAULT_LITERALS as l
} from './LoginForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { linkRendererMock } from '../../../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';

interface TestLoginFormProps extends Partial<LoginFormProps> {
  onSubmit?: (values: Values) => void;
}
const Component: FC<TestLoginFormProps> = ({ onSubmit = jest.fn() }) => {
  const formController = useForm<Values>({
    resolver: yupResolver(loginSchema(dl))
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={formController.handleSubmit((values) => onSubmit(values))}>
      <LoginForm
        formController={formController}
        linkRenderer={linkRendererMock}
        resetPasswordLink="/reset"
        registerLink="/register"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('LoginForm', () => {
  describe('actions', () => {
    it('should submit with correct values', async () => {
      const onSubmitSpy = jest.fn();
      const values = {
        password: 'asdfASDF1234$',
        username: 'foo@bar.es'
      };
      render(<Component onSubmit={onSubmitSpy} />);

      fireEvent.change(screen.getByLabelText(l.passwordPlaceholder), {
        target: { value: values.password }
      });
      fireEvent.change(screen.getByLabelText(l.userPlaceholder), {
        target: { value: values.username }
      });
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
      });

      expect(onSubmitSpy).toHaveBeenCalledWith(values);
    });
  });

  describe('errors', () => {
    it('should render required errors', async () => {
      render(<Component />);

      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
      });

      expect(screen.getByText(dl.invalidEmail)).toBeInTheDocument();
      expect(screen.getByText(dl.requiredPassword)).toBeInTheDocument();
    });
  });
});
