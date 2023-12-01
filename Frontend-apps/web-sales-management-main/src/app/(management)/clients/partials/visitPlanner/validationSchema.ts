import * as yup from 'yup';
import {
  FrequencyType,
  type FormValues,
  type WeekDay,
  BiweeklyGroup,
  MonthlyGroup
} from './types';

import {
  frequencyTypes,
  biweeklyGroups,
  monthlyGroups,
  weekDays
} from './utils';

const validationSchema: yup.ObjectSchema<FormValues> = yup.object().shape({
  noVisit: yup.boolean(),
  daySelector: yup
    .mixed<WeekDay>()
    .oneOf(weekDays)
    .when('noVisit', {
      is: false,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired()
    }),
  frequencyType: yup
    .mixed<FrequencyType>()
    .oneOf(frequencyTypes)
    .when('noVisit', {
      is: false,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired()
    }),
  position: yup.number().when('noVisit', {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required('Campo requerido')
  }),
  biweeklyGroups: yup
    .mixed<BiweeklyGroup>()
    .oneOf(biweeklyGroups)
    .when(['noVisit', 'frequencyType'], {
      is: (noVisit: boolean, frequencyType: FrequencyType) => {
        return !noVisit && frequencyType === 'biweekly';
      },
      then: (schema) => schema.required('Campo requerido'),
      otherwise: (schema) => schema.notRequired()
    }),
  monthlyGroups: yup
    .mixed<MonthlyGroup>()
    .oneOf(monthlyGroups)
    .when(['noVisit', 'frequencyType'], {
      is: (noVisit: boolean, frequencyType: FrequencyType) => {
        return !noVisit && frequencyType === 'monthly';
      },
      then: (schema) => schema.required('Campo requerido'),
      otherwise: (schema) => schema.notRequired()
    })
});

export { validationSchema };
