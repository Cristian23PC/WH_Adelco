import { PageResults } from './PageResults';

export interface Branch {
  id: number;
  name: string;
  code: string;
  zone: {
    id?: number;
    name: string;
    zoneManagerId?: number;
  };
  supervisedAreasCounter: number;
}

export interface BranchPayload {
  name: string;
  zoneId: number;
  code: string;
}

export interface BranchesPageResultResponse extends PageResults<Branch> {}

export interface BranchesPageResult extends PageResults<Branch> {}
