import { Role } from '@/types/User';
import {
  getSupervisedAreaDefaultValues,
  getSupervisorDefaultOptions,
  mapUsersToDropdownOptions,
  supervisedAreaLiterals
} from './utils';

const mockSupervisedArea = {
  id: 1,
  name: 'foo-name',
  supervisorId: 'foo-supervisor',
  branchId: '1',
  territoriesCounter: 4,
  supervisorName: 'supervisor name',
  territory: 'territory name'
};

const reportsTo = {
  createdAt: '',
  updatedAt: '',
  username: '',
  firstName: '',
  lastName: '',
  role: Role.Admin,
  status: ''
};

const mockUsers = [
  {
    firstName: 'Alice',
    lastName: 'Smith',
    username: 'alice.smith',
    phone: '',
    role: Role.Admin,
    status: '',
    reportsTo,
    createdAt: '',
    updatedAt: ''
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    username: 'bob.johnson',
    phone: '',
    role: Role.Admin,
    status: '',
    reportsTo,
    createdAt: '',
    updatedAt: ''
  }
];

describe('Utility Functions', () => {
  describe('getSupervisedAreaDefaultValues', () => {
    it('should return default values if no supervised area provided', () => {
      const defaultValues = getSupervisedAreaDefaultValues();
      expect(defaultValues).toEqual({
        name: '',
        supervisorId: '',
        branchId: ''
      });
    });

    it('should return provided supervised area values', () => {
      const defaultValues = getSupervisedAreaDefaultValues(mockSupervisedArea);
      expect(defaultValues).toEqual({
        branchId: '1',
        name: 'foo-name',
        supervisorId: 'foo-supervisor'
      });
    });
  });

  describe('getSupervisorDefaultOptions', () => {
    it('should return an empty array if no zone provided', () => {
      const options = getSupervisorDefaultOptions();
      expect(options).toEqual([]);
    });

    it('should return an array with a single option', () => {
      const options = getSupervisorDefaultOptions(mockSupervisedArea);
      expect(options).toEqual([
        { label: 'supervisor name', value: 'foo-supervisor' }
      ]);
    });
  });

  describe('mapUsersToDropdownOptions', () => {
    it('should return an empty array if no users provided', () => {
      const options = mapUsersToDropdownOptions([]);
      expect(options).toEqual([]);
    });

    it('should map users to option objects', () => {
      const options = mapUsersToDropdownOptions(mockUsers);
      expect(options).toEqual([
        { label: 'Alice Smith', value: 'alice.smith' },
        { label: 'Bob Johnson', value: 'bob.johnson' }
      ]);
    });
  });

  describe('supervisedAreaLiterals', () => {
    it('should match edit literals', () => {
      expect(supervisedAreaLiterals.edit).toEqual({
        title: 'Información del área supervisada',
        buttonLabel: 'Guardar cambios'
      });
    });

    it('should match add literals', () => {
      expect(supervisedAreaLiterals.add).toEqual({
        title: 'Crear área supervisada',
        buttonLabel: 'Crear área supervisada'
      });
    });
  });
});
