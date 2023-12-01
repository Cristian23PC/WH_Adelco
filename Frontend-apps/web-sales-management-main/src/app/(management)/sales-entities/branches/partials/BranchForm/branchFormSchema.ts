import * as Yup from 'yup';

export type BranchFormValues = {
  name: string;
  zoneId: string;
  code: string;
};

export const branchFormSchema: Yup.ObjectSchema<BranchFormValues> =
  Yup.object().shape({
    name: Yup.string().required('El nombre de la sucursal es obligatorio'),
    zoneId: Yup.string().required('La zona es obligatoria'),
    code: Yup.string()
      .required('El código de la sucursal es obligatorio')
      .min(4, 'El código debe ser de 4 dígitos')
      .max(4, 'El código debe ser de 4 dígitos')
  });
