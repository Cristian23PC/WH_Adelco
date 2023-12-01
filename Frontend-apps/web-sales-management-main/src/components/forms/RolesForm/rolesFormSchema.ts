import { ObjectSchema, object, string } from 'yup';
import { Values } from './RolesForm';

export default object<ObjectSchema<Values>>({
  role: string().required()
});
