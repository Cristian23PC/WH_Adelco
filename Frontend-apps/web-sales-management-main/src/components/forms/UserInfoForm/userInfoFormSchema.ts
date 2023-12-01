import { ObjectSchema, object, string } from 'yup';
import { Values } from './UserInfoForm';

export default object<ObjectSchema<Values>>({
  username: string().email().required(),
  firstName: string().required(),
  lastName: string().required(),
  phone: string().test(
    (value) => value === '' || (value?.length === 11 && value?.startsWith('9'))
  )
});
