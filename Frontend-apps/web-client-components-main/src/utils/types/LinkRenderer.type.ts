import { type ReactElement, type ReactNode } from 'react';
import type Target from './Target.type';
import { type UseFormGetValues } from 'react-hook-form';

type LinkRenderer = (
  link: string,
  label: ReactNode,
  target?: Target,
  getFormValues?: UseFormGetValues<any>
) => ReactElement;

export default LinkRenderer;
