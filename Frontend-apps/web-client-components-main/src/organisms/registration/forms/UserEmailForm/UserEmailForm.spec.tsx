import React, { type FC } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UserEmailForm, {
  type UserEmailFormProps,
  type Values
} from './UserEmailForm';

const Component: FC<Partial<UserEmailFormProps>> = (props) => (
  <UserEmailForm onSubmit={jest.fn()} {...props} />
);

describe('UserEmailForm', () => {
  describe('render', () => {
    it('should disabled all field if there is readOnly', async () => {
      await act(async () => {
        render(<Component readOnly />);
      });

      expect(screen.getByLabelText('Nombre')).toBeDisabled();
      expect(screen.getByLabelText('Apellido')).toBeDisabled();
      expect(screen.getByLabelText('Correo electrónico')).toBeDisabled();
      expect(screen.getByLabelText('Teléfono')).toBeDisabled();
      expect(
        screen.getByLabelText('RUT de empresa (sin puntos ni guión)')
      ).toBeDisabled();
    });
  });

  describe('actions', () => {
    it('should submit if all of the values are correct', async () => {
      const onSubmitSpy = jest.fn();
      const defaultValues: Values = {
        username: 'foo@foo.com',
        firstName: 'foo',
        phone: '56666666666',
        rut: '9.068.826-k',
        surname: 'bar'
      };
      render(
        <Component onSubmit={onSubmitSpy} defaultValues={defaultValues} />
      );

      await act(async () => {
        fireEvent.click(screen.getByText('Siguiente'));
      });

      expect(onSubmitSpy).toHaveBeenCalledWith(defaultValues);
    });

    it('should submit if set all values manually', async () => {
      const onSubmitSpy = jest.fn();
      const values: Values = {
        username: 'bar@bar.com',
        firstName: 'bar',
        phone: '56464464464',
        rut: '9068826-k',
        surname: 'foo'
      };
      render(<Component onSubmit={onSubmitSpy} />);

      fireEvent.change(screen.getByLabelText('Nombre'), {
        target: { value: values.firstName }
      });
      fireEvent.change(screen.getByLabelText('Apellido'), {
        target: { value: values.surname }
      });
      fireEvent.change(screen.getByLabelText('Correo electrónico'), {
        target: { value: values.username }
      });
      fireEvent.change(screen.getByLabelText('Teléfono'), {
        target: { value: '464464464' }
      });
      fireEvent.change(
        screen.getByLabelText('RUT de empresa (sin puntos ni guión)'),
        {
          target: { value: values.rut }
        }
      );

      await act(async () => {
        fireEvent.click(screen.getByText('Siguiente'));
      });

      expect(onSubmitSpy).toHaveBeenCalledWith(values);
    });
  });

  describe('errors', () => {
    it('should show all error if there is all fields empty', async () => {
      const onSubmitSpy = jest.fn();
      render(<Component onSubmit={onSubmitSpy} />);

      await act(async () => {
        fireEvent.click(screen.getByText('Siguiente'));
      });

      expect(screen.getByText('Nombre incompleto')).toBeInTheDocument();
      expect(screen.getByText('Apellido incompleto')).toBeInTheDocument();
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
      expect(screen.getByText('Teléfono incompleto')).toBeInTheDocument();
      expect(screen.getByText('RUT inválido')).toBeInTheDocument();
    });

    it('should show error if email is invalid', async () => {
      const onSubmitSpy = jest.fn();
      render(
        <Component
          onSubmit={onSubmitSpy}
          defaultValues={{ username: 'is-invalid' }}
        />
      );

      await act(async () => {
        fireEvent.click(screen.getByText('Siguiente'));
      });

      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    });

    it('should show error if rut is invalid', async () => {
      const onSubmitSpy = jest.fn();
      render(
        <Component
          onSubmit={onSubmitSpy}
          defaultValues={{ rut: 'is-invalid' }}
        />
      );

      await act(async () => {
        fireEvent.click(screen.getByText('Siguiente'));
      });

      expect(screen.getByText('RUT inválido')).toBeInTheDocument();
    });
  });
});
