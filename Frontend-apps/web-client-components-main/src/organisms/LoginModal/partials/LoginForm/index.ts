import { DEFAULT_LITERALS as DLF, type Values } from './LoginForm';
import loginSchema, { DEFAULT_LITERALS as DLS } from './loginSchema';
export { default } from './LoginForm';

const DEFAULT_LITERALS = {
  ...DLF,
  ...DLS
};

export { DEFAULT_LITERALS, type Values, loginSchema };
