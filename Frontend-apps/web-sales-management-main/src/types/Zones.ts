import { PageResults } from './PageResults';

export interface ZoneManager {
  createdAt: Date;
  updatedAt: Date;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

export interface Zone {
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date;
  id: number;
  name: string;
  zoneManager: ZoneManager;
  branchesCounter: number;
}

export interface ZonePayload {
  name: string;
  zoneManagerId?: string;
}

export interface ZonesPageResultResponse extends PageResults<Zone> {}
export interface ZonesPageResult extends PageResults<Zone> {}
