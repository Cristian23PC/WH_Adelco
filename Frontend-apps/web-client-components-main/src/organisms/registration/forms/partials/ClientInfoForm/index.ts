import ClientInfoForm, {
  DEFAULT_LITERALS as DLF,
  type Values
} from './ClientInfoForm';
import clientInfoSchema, { DEFAULT_LITERALS as DLS } from './clientInfoSchema';

const DEFAULT_LITERALS = {
  ...DLS,
  ...DLF
};

export { clientInfoSchema, DEFAULT_LITERALS, type Values };

export default ClientInfoForm;
