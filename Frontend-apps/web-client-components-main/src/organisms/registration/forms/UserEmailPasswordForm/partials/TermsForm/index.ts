import TermsForm, { DEFAULT_LITERALS as DLF, type Values } from './TermsForm';
import termsSchema, { DEFAULT_LITERALS as DLS } from './termsSchema';

const DEFAULT_LITERALS = {
  ...DLF,
  ...DLS
};

export { DEFAULT_LITERALS, type Values, termsSchema };
export default TermsForm;
