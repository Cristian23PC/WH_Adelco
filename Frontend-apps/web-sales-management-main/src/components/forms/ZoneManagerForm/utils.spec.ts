import { Role, UserRelated } from '@/types/User';
import {
  getUserDefaultOption,
  getUserLabel
} from '@/components/forms/ZoneManagerForm/utils';

describe('util functions', () => {
  const userMock = {
    createdAt: '',
    updatedAt: '',
    username: 'johndoe@test.test',
    firstName: 'John',
    lastName: 'Doe',
    role: Role.Supervisor,
    status: 'active'
  };
  describe('get User label', () => {
    it('should return empty string', () => {
      expect(getUserLabel()).toEqual('');
    });
    it('should return label', () => {
      expect(getUserLabel(userMock)).toEqual('John Doe');
    });
  });
  describe('get default options', () => {
    it('should return empty array', () => {
      expect(getUserDefaultOption()).toEqual([]);
    });
    it('should return an array with default option', () => {
      expect(getUserDefaultOption(userMock)).toEqual([
        { label: 'John Doe', value: 'johndoe@test.test' }
      ]);
    });
  });
});
