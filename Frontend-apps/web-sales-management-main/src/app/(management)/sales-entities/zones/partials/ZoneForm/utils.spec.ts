import { Role } from '@/types/User';
import {
  getZoneDefaultValues,
  getZoneManagerDefaultOptions,
  mapUsersToDropdownOptions,
  mapZoneBranchesToHeaderData,
  zoneLiterals
} from './utils';

describe('Utility Functions', () => {
  const date = new Date();
  describe('getZoneDefaultValues', () => {
    it('should return default values if no zone provided', () => {
      const defaultValues = getZoneDefaultValues();
      expect(defaultValues).toEqual({
        name: '',
        zoneManagerId: undefined
      });
    });

    it('should return provided zone values', () => {
      const zone = {
        name: 'Test Zone',
        zoneManager: {
          username: 'manager1',
          createdAt: date,
          updatedAt: date,
          firstName: 'manager',
          lastName: '1',
          role: '',
          status: ''
        },
        createdAt: date,
        deletedAt: date,
        updatedAt: date,
        id: 1,
        branchesCounter: 2
      };
      const defaultValues = getZoneDefaultValues(zone);
      expect(defaultValues).toEqual({
        name: 'Test Zone',
        zoneManagerId: 'manager1'
      });
    });
  });

  describe('getZoneManagerDefaultOptions', () => {
    it('should return an empty array if no zoneManager provided', () => {
      const options = getZoneManagerDefaultOptions();
      expect(options).toEqual([]);
    });

    it('should return an array with a single option', () => {
      const zoneManager = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john.doe',
        createdAt: date,
        updatedAt: date,
        role: '',
        status: ''
      };
      const options = getZoneManagerDefaultOptions(zoneManager);
      expect(options).toEqual([{ label: 'John Doe', value: 'john.doe' }]);
    });
  });

  describe('mapUsersToDropdownOptions', () => {
    it('should return an empty array if no users provided', () => {
      const options = mapUsersToDropdownOptions([]);
      expect(options).toEqual([]);
    });

    it('should map users to option objects', () => {
      const reportsTo = {
        createdAt: '',
        updatedAt: '',
        username: '',
        firstName: '',
        lastName: '',
        role: Role.Admin,
        status: ''
      };
      const users = [
        {
          firstName: 'Alice',
          lastName: 'Smith',
          username: 'alice.smith',
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
          role: Role.Admin,
          status: '',
          reportsTo,
          createdAt: '',
          updatedAt: ''
        }
      ];
      const options = mapUsersToDropdownOptions(users);
      expect(options).toEqual([
        { label: 'Alice Smith', value: 'alice.smith' },
        { label: 'Bob Johnson', value: 'bob.johnson' }
      ]);
    });
  });

  describe('mapZoneBranchesToHeaderData', () => {
    it('should map zone branches to header data', () => {
      // TODO: use the right structure
      const branches = ['ABC123', 'ABC456', 'ABC789'];
      const headerData = mapZoneBranchesToHeaderData(branches);
      expect(headerData).toEqual([
        { title: 'Área', value: 'ABC123' },
        { title: 'Área', value: 'ABC456' },
        { title: 'Área', value: 'ABC789' }
      ]);
    });
  });

  describe('zoneLiterals', () => {
    it('should match edit literals', () => {
      expect(zoneLiterals.edit).toEqual({
        title: 'Información de la zona',
        buttonLabel: 'Guardar cambios'
      });
    });

    it('should match add literals', () => {
      expect(zoneLiterals.add).toEqual({
        title: 'Crear zona',
        buttonLabel: 'Crear zona'
      });
    });
  });
});
