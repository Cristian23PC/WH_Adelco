import { type ObjectSchema, object, string } from 'yup';

export const DEFAULT_LITERALS = {
  invalidEmail: 'Este email no es válido'
};

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<{ email: string }> =>
  object({
    email: string().required(literals.invalidEmail).email(literals.invalidEmail)
  });
