import { type ComponentType } from 'react';

export default interface DynamicComponent {
  Component: string | ComponentType<any>;
  props: Record<string, any>;
}

export const defaultDynamicLink = {
  Component: 'a',
  props: { href: '#' }
};

export const defaultDynamicImg = {
  Component: 'img',
  props: { src: '#' }
};
