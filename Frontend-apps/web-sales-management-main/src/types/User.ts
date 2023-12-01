import { PageResults } from './PageResults';

export enum Role {
  Admin = 'admin',
  GeneralManager = 'general-manager',
  ZoneManager = 'zone-manager',
  Supervisor = 'supervisor',
  SalesRep = 'sales-rep'
}

export const Supervisor: {
  [Role.SalesRep]: Role.Supervisor;
  [Role.Supervisor]: Role.ZoneManager;
  [Role.ZoneManager]: Role.GeneralManager;
} = {
  [Role.SalesRep]: Role.Supervisor,
  [Role.Supervisor]: Role.ZoneManager,
  [Role.ZoneManager]: Role.GeneralManager
};

export interface UserRelated {
  createdAt: string;
  updatedAt: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: string;
}

export interface UserPayload {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  status: string;
  reportsTo: UserRelated;
  reportsToId?: string | null;
}

export interface User extends UserPayload {
  createdAt: string;
  updatedAt: string;
}

export interface UsersPageResult extends PageResults<User> {}
