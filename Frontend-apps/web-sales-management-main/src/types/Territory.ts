import { PageResults } from './PageResults';

export interface SalesRep {
  username?: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SupervisedArea {
  id: number;
  name: string;
  branchId: number;
  supervisorId: string;
}

export interface Territory {
  id: number;
  name: string;
  externalId: string | null;
  description: string;
  salesRep: SalesRep;
  supervisedArea: SupervisedArea;
  businessUnitsCounter: number;
}

export interface TerritoryPayload {
  externalId?: string;
  name: string;
  supervisedAreaId: number;
  salesRepId?: string | null;
  description?: string;
}

export interface TerritoriesPageResultResponse extends PageResults<Territory> {}

export interface TerritoriesPageResult extends PageResults<Territory> {}
