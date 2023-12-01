import {
  getBranchDefaultValues,
  getZoneDefaultOptions,
  mapZonesToDropdownOptions,
  mapSupervicedAreasToHeaderData,
  branchLiterals
} from './utils';

const date = new Date();

const mockBranch = {
  id: 1,
  name: 'test branch',
  code: '0010',
  zone: {
    id: 10,
    name: 'test zone',
    zoneManagerId: 100
  },
  supervisedAreasCounter: 2
};

const mockZones = [
  {
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
  },
  {
    name: 'Test Zone 2',
    zoneManager: {
      username: 'manager2',
      createdAt: date,
      updatedAt: date,
      firstName: 'manager',
      lastName: '2',
      role: '',
      status: ''
    },
    createdAt: date,
    deletedAt: date,
    updatedAt: date,
    id: 2,
    branchesCounter: 0
  }
];

describe('Utility Functions', () => {
  describe('getBranchDefaultValues', () => {
    it('should return default values if no branch provided', () => {
      const defaultValues = getBranchDefaultValues();
      expect(defaultValues).toEqual({
        name: '',
        zoneId: '',
        code: ''
      });
    });

    it('should return provided branch values', () => {
      const defaultValues = getBranchDefaultValues(mockBranch);
      expect(defaultValues).toEqual({
        name: 'test branch',
        zoneId: '10',
        code: '0010'
      });
    });
  });

  describe('getZoneDefaultOptions', () => {
    it('should return an empty array if no zone provided', () => {
      const options = getZoneDefaultOptions();
      expect(options).toEqual([]);
    });

    it('should return an array with a single option', () => {
      const options = getZoneDefaultOptions(mockBranch.zone);
      expect(options).toEqual([{ label: 'test zone', value: '10' }]);
    });
  });

  describe('mapZonesToDropdownOptions', () => {
    it('should return an empty array if no zones provided', () => {
      const options = mapZonesToDropdownOptions([]);
      expect(options).toEqual([]);
    });

    it('should map zones to option objects', () => {
      const options = mapZonesToDropdownOptions(mockZones);
      expect(options).toEqual([
        { label: 'Test Zone', value: '1' },
        { label: 'Test Zone 2', value: '2' }
      ]);
    });
  });

  describe('mapSupervicedAreasToHeaderData', () => {
    it('should map branches supervised areas to header data', () => {
      // TODO: use the right structure
      const branches = ['ABC123', 'ABC456', 'ABC789'];
      const headerData = mapSupervicedAreasToHeaderData(branches);
      expect(headerData).toEqual([
        { title: 'Área', value: 'ABC123' },
        { title: 'Área', value: 'ABC456' },
        { title: 'Área', value: 'ABC789' }
      ]);
    });
  });

  describe('branchLiterals', () => {
    it('should match edit literals', () => {
      expect(branchLiterals.edit).toEqual({
        title: 'Información de la sucursal',
        buttonLabel: 'Guardar cambios'
      });
    });

    it('should match add literals', () => {
      expect(branchLiterals.add).toEqual({
        title: 'Crear sucursal',
        buttonLabel: 'Crear sucursal'
      });
    });
  });
});
