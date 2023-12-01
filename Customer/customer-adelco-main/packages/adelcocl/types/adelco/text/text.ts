export interface TextProps {
  variant: TextVariant;
  align: Align;
  hidden: string;
  description: string;
}

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'paragraph1' | 'paragraph2';

type Align = 'left' | 'center' | 'right';
