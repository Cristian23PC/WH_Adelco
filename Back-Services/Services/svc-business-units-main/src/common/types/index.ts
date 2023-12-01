import { userHeaderId, userHeaderRoles } from '../constants/headers';

export type THeaders = {
  [userHeaderId]?: string;
  [userHeaderRoles]?: string[];
};
