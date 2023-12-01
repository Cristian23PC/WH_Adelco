import { Role } from '@/types/User';

export const getSupervisedUser = (role: Role): Role | null => {
  if (role === Role.SalesRep) return Role.Supervisor;
  if (role === Role.Supervisor) return Role.ZoneManager;
  if (role === Role.ZoneManager) return Role.GeneralManager;
  return null;
};
