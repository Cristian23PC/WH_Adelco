/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform, TransformFnParams } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim();
  });
