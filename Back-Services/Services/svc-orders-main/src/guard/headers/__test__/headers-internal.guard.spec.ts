import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { HeaderInternalGuard } from '../headers-internal.guard';
import { Roles } from '@/common/enum/roles.enum';
import { BadRequestException, ExecutionContext, ForbiddenException } from '@nestjs/common';

type CtxMock = {
  switchToHttp: () => {
    getRequest: () => {
      headers: {
        [key: string]: string;
      };
    };
  };
} & ExecutionContext;

const ctxMock = (user: string, roles: string) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { [userHeaderId]: user, [userHeaderRoles]: roles }
      })
    })
  } as CtxMock);

describe('HeaderInternalGuard', () => {
  let guard: HeaderInternalGuard;
  beforeEach(() => {
    jest.clearAllMocks();
    guard = new HeaderInternalGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true', () => {
    expect(guard.canActivate(ctxMock('user', `["${Roles.Internal}"]`))).toBe(true);
  });

  it('should throw an ForbiddenException', () => {
    try {
      guard.canActivate(ctxMock('user', '["BAD-HEADER"]'));
    } catch (error) {
      expect(error).toEqual(new ForbiddenException('Insufficient permissions'));
    }
  });

  it('should throw an error when role is not an stringify array', () => {
    try {
      guard.canActivate(ctxMock('user', 'role'));
    } catch (error) {
      expect(error).toEqual(new BadRequestException(`Bad ${userHeaderRoles} format`));
    }
  });

  it('should throw an error when no user id is provided', () => {
    try {
      guard.canActivate(ctxMock(undefined, `["${Roles.Internal}"]`));
    } catch (error) {
      expect(error).toEqual(new BadRequestException('User ID missing'));
    }
  });

  it('should throw an error when no user id is provided', () => {
    try {
      guard.canActivate(ctxMock('user', '[]'));
    } catch (error) {
      expect(error).toEqual(new BadRequestException('User Roles missing'));
    }
  });
});
