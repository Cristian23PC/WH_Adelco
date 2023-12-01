import BusinessInfoForm, {
  type Values,
  DEFAULT_LITERALS as DLF
} from './BusinessInfoForm';
import businessInfoSchema, {
  DEFAULT_LITERALS as DLS
} from './businessInfoSchema';

const DEFAULT_LITERALS = {
  ...DLF,
  ...DLS
};

export { DEFAULT_LITERALS, businessInfoSchema, type Values };

export default BusinessInfoForm;
