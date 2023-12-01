import * as Yup from 'yup';

export type ZoneFormValues = {
  name: string;
  zoneManagerId?: string;
};

export const zoneFormSchema: Yup.ObjectSchema<ZoneFormValues> =
  Yup.object().shape({
    name: Yup.string().required('El nombre de la zona es obligatorio'),
    zoneManagerId: Yup.string()
  });
