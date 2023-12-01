import { type ObjectSchema } from 'yup';

export const mergeSchemas = (
  ...schemas: Array<ObjectSchema<any>>
): ObjectSchema<any> => {
  const [first, ...rest] = schemas;

  const merged = rest.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    first
  );

  return merged;
};
