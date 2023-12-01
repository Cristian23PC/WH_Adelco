import { User, Zone } from '@Types/adelco/user';

export interface UseUserAccount {
  userAccount: User;
  setZone: (zone: Zone) => Promise<void>;
  logout: () => Promise<void>;
}
