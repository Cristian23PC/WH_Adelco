import PasswordForm from './PasswordForm';
import passwordSchema, { DEFAULT_LITERALS as DLS } from './passwordSchema';
import { DEFAULT_LITERALS as DLF, type Values } from './PasswordForm';

const DEFAULT_LITERALS = {
  ...DLS,
  ...DLF
};

export { DEFAULT_LITERALS, type Values, passwordSchema };

export default PasswordForm;
