/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export const SameAs = (property: string, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'sameAs',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return args.object[relatedPropertyName] === value;
        },
        defaultMessage(): string {
          return '$property must match $constraint1';
        }
      }
    });
  };
};
