import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TransformHeaderGuard } from '../transformHeader.guard';
import { userHeaderRoles } from '@/common/constants/headers';

describe('TransformHeaderGuard', () => {
  let guard: TransformHeaderGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TransformHeaderGuard]
    }).compile();

    guard = module.get<TransformHeaderGuard>(TransformHeaderGuard);
  });

  it('should return true when roles are in valid JSON format and an array', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            [userHeaderRoles]: JSON.stringify(['role1', 'role2'])
          }
        })
      })
    };

    expect(guard.canActivate(context as any)).toBe(true);
  });

  it('should throw BadRequestException when roles are in invalid JSON format', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            [userHeaderRoles]: "{['role1', 'role2']}" // invalid JSON
          }
        })
      })
    };

    expect(() => guard.canActivate(context as any)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when roles are not an array', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            [userHeaderRoles]: JSON.stringify('role1') // not an array
          }
        })
      })
    };

    expect(() => guard.canActivate(context as any)).toThrow(BadRequestException);
  });
});
