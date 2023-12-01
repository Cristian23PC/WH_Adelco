import { Role } from '@/types/User';
import { getDefaultSalesRepOptions, getSalesRepLabel } from './utils';

describe('utils functions', () => {
  const salesRepMock = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe@test.test',
    role: Role.SalesRep,
    createdAt: '',
    status: '',
    updatedAt: ''
  };
  const territoryMock = {
    id: 1,
    name: 'Territory 01',
    externalId: 'external-id',
    description: 'territory 1',
    salesRep: salesRepMock,
    supervisedArea: {
      id: 1,
      name: 'area-1',
      branchId: 1,
      supervisorId: 'supervisor 1'
    },
    businessUnitsCounter: 0
  };
  describe('get label', () => {
    it('should return empty string', () => {
      expect(getSalesRepLabel()).toEqual('');
    });
    it('should return a constructed label', () => {
      expect(getSalesRepLabel(salesRepMock)).toEqual('John Doe');
    });
  });
  describe('get default options', () => {
    it('should return empty array', () => {
      expect(getDefaultSalesRepOptions()).toEqual([]);
    });
    it('should return an array with default option', () => {
      expect(getDefaultSalesRepOptions(territoryMock)).toEqual([
        { label: 'John Doe', value: 'johndoe@test.test' }
      ]);
    });
  });
});
