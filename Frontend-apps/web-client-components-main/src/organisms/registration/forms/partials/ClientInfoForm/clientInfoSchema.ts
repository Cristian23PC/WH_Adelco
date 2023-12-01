import { object, string, type ObjectSchema } from 'yup';
import { type Values } from './ClientInfoForm';

export const DEFAULT_LITERALS = {
  requiredName: 'Nombre incompleto',
  requiredSurname: 'Apellido incompleto',
  invalidEmail: 'Correo inválido',
  requiredPhone: 'Teléfono incompleto'
};

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<Values> =>
  object({
    firstName: string()
      .required(literals.requiredName)
      .min(3, literals.requiredName),
    surname: string()
      .required(literals.requiredSurname)
      .min(3, literals.requiredSurname),
    username: string()
      .required(literals.invalidEmail)
      .matches(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        literals.invalidEmail
      ),
    phone: string()
      .required(literals.requiredPhone)
      // 9 digits and 2 spaces for format
      .test('length', literals.requiredPhone, (value) => value.length === 11),
    prefix: string().required(literals.requiredPhone)
  });
