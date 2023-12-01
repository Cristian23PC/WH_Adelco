import { mapBranchesOptions, getBranchesOptions } from './branches';
import { Branch } from '@/types/Branch';
import { Option } from '@/types/Option';

describe('branches', () => {
  describe('mapBranchesOptions', () => {
    it('should map a Branch to an Option correctly', () => {
      const branch: Branch = {
        id: 1,
        name: 'Branch 1',
        code: 'B1',
        zone: { id: 101, name: 'Zone A', zoneManagerId: 201 },
        supervisedAreasCounter: 5
      };
      const expectedOption: Option = { value: '1', label: 'Branch 1' };
      const result = mapBranchesOptions(branch);
      expect(result).toEqual(expectedOption);
    });
  });
  describe('getBranchesOptions', () => {
    it('should map an array of Branches to an array of Options correctly', () => {
      const branches: Branch[] = [
        {
          id: 1,
          name: 'Branch 1',
          code: 'B1',
          zone: { id: 101, name: 'Zone A', zoneManagerId: 201 },
          supervisedAreasCounter: 5
        },
        {
          id: 2,
          name: 'Branch 2',
          code: 'B2',
          zone: { id: 102, name: 'Zone B', zoneManagerId: 202 },
          supervisedAreasCounter: 7
        }
      ];
      const expectedOptions: Option[] = [
        { value: '1', label: 'Branch 1' },
        { value: '2', label: 'Branch 2' }
      ];

      const result = getBranchesOptions(branches);
      expect(result).toEqual(expectedOptions);
    });
  });
});
