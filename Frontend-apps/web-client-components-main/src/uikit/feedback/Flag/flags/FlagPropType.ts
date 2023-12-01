import type { SVGAttributes } from 'react';

export default interface Props extends SVGAttributes<SVGElement> {
  'data-testid'?: string;
}
