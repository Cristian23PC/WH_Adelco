import { ObjectSchema, object, string } from 'yup';

export type SupervisedAreaFormValues = {
  name: string;
  supervisorId: string;
  branchId: string;
};

const supervisedAreaSchema: ObjectSchema<SupervisedAreaFormValues> = object({
  name: string().required(),
  supervisorId: string().required(),
  branchId: string().required()
});

export default supervisedAreaSchema;
