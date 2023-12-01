import * as Yup from 'yup';
export const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre de territorio es obligatorio'),
  supervisedArea: Yup.string().required('El área supervisada es obligatoria'),
  salesRep: Yup.string(),
  description: Yup.string().max(140, 'Has superado el límite de caracteres')
});
