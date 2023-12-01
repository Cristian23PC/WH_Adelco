import { PageResults } from './PageResults';

export interface SupervisedAreaResponse {
  id: number;
  name: string;
  branch: {
    id: number;
    name: string;
    zoneId: number;
  };
  supervisor?: {
    firstName: string;
    lastName: string;
    username: string;
  };
  territoriesCounter: number;
}

export interface SupervisedAreasPageResultResponse
  extends PageResults<SupervisedAreaResponse> {}

export interface SupervisedArea
  extends Pick<SupervisedAreaResponse, 'id' | 'name' | 'territoriesCounter'> {
  supervisorName: string;
  territory: string;
  branchId?: string;
  supervisorId: string;
}

export interface SupervisedAreasPageResult
  extends PageResults<SupervisedArea> {}

export interface SupervisedAreaDraft
  extends Pick<SupervisedArea, 'name' | 'branchId' | 'supervisorId'> {}
