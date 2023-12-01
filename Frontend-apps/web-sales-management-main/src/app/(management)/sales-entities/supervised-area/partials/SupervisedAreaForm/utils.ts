import { SupervisedArea } from '@/types/SupervisedAreas';
import { User } from '@/types/User';
import { SupervisedAreaFormValues } from './supervisedAreaSchema';

export type OptionObject = {
  label: string;
  value: string;
};

export const supervisedAreaLiterals = {
  edit: {
    title: 'Información del área supervisada',
    buttonLabel: 'Guardar cambios'
  },
  add: {
    title: 'Crear área supervisada',
    buttonLabel: 'Crear área supervisada'
  }
};

export const getSupervisedAreaDefaultValues = (
  supervisedArea?: SupervisedArea
): SupervisedAreaFormValues => {
  return {
    name: supervisedArea?.name || '',
    supervisorId: supervisedArea?.supervisorId || '',
    branchId: supervisedArea?.branchId || ''
  };
};

export const getSupervisorDefaultOptions = (
  supervisedArea?: SupervisedArea
): OptionObject[] => {
  return supervisedArea
    ? [
        {
          label: supervisedArea.supervisorName,
          value: supervisedArea.supervisorId
        }
      ]
    : [];
};

export const getBranchesDefaultOptions = (
  supervisedArea?: SupervisedArea
): OptionObject[] => {
  return supervisedArea?.branchId
    ? [
        {
          label: supervisedArea.territory,
          value: supervisedArea.branchId
        }
      ]
    : [];
};

const transformUserToDropdownOption = (user: User): OptionObject => {
  return {
    label: [user?.firstName, user?.lastName].filter(Boolean).join(' '),
    value: user?.username || ''
  };
};

export const mapUsersToDropdownOptions = (users: User[]): OptionObject[] => {
  return users?.map(transformUserToDropdownOption);
};
