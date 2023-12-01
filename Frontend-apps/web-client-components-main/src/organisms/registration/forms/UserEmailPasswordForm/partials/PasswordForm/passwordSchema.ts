import { object, string, type ObjectSchema, ref } from 'yup';
import { type Values } from './PasswordForm';

export const DEFAULT_LITERALS = {
  requiredPassword: 'Contraseña incompleta',
  requiredConfirmPassword: 'Confirmar contraseña incompleta',
  invalidPassword: 'Ingresa una contraseña válida',
  passwordDontMatch: 'Las contraseñas ingresadas no coinciden'
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*)(?=.*\W).{8,}$/;

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<Values> =>
  object({
    password: string()
      .required(literals.requiredPassword)
      .matches(passwordRegex, literals.invalidPassword),
    confirmPassword: string()
      .required(literals.requiredConfirmPassword)
      .oneOf([ref('password')], literals.passwordDontMatch)
  });
