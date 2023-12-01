import { object, boolean, type ObjectSchema } from 'yup';
import { type Values } from './TermsForm';

export const DEFAULT_LITERALS = {
  requiredTerms: 'Debes aceptar los Términos y condiciones para continuar'
};

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<Values> =>
  object({
    acceptTerms: boolean()
      .oneOf([true], literals.requiredTerms)
      .required(literals.requiredTerms)
  });
