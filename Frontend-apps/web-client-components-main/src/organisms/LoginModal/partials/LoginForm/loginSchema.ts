import { type ObjectSchema, object, string } from 'yup';
import { type Values } from './LoginForm';

export const DEFAULT_LITERALS = {
  invalidEmail: 'Correo incorrecto o no coincide con la contraseña',
  requiredPassword: 'La contraseña ingresada es incorrecta'
};

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<Values> =>
  object({
    username: string()
      .required(literals.invalidEmail)
      .email(literals.invalidEmail),
    password: string().required(literals.requiredPassword)
  });
