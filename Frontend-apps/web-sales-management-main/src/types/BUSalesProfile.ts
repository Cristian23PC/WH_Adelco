import { PageResults } from './PageResults';
import { SalesRep } from './Territory';

export interface SchedulingRule {
  daySelector?: {
    [key in
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'
      | 'sunday']?: number;
  };
  frequencyCode: number;
}

export interface Schedule {
  type: string;
  schedulingRule: SchedulingRule;
}

interface Availability {
  start: string;
  end: string;
}

export interface VisitSchedule {
  visitSchedule: Schedule;
}

interface Territory {
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
  id: number;
  name: string;
  externalId?: string;
  supervisedAreaId: number;
  salesRep: SalesRep;
}

interface UserRelated {
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  status: string;
  role: string;
  phone: string | null;
  rut: string | null;
}

interface Supervisor extends UserRelated {}

interface ZoneManager extends UserRelated {}
export interface BUSalesProfileResponse {
  id: number;
  externalId: string | null;
  ctId: string;
  name: string;
  schedule: Schedule;
  status: any;
  coordinates: any;
  availability: Array<{
    [key in
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'
      | 'sunday']: Availability[];
  }>;
  territory: Territory;
  salesChannel: string | null;
  customerName: string;
  zoneManager: ZoneManager;
  supervisor: Supervisor;
  address: string;
}

export interface BUSalesProfilePageResultResponse
  extends PageResults<BUSalesProfileResponse> {}

export interface BUSalesProfile {
  id: number;
  name: string;
  salesRepName: string;
  territoryName: string;
  schedule?: Schedule;
  address: string;
  channel: string;
  customerName: string;
  zoneManagerName: string;
  supervisorName: string;
}

export interface BUSalesProfilePageResult extends PageResults<BUSalesProfile> {}

export interface BUSalesProfileVisit {
  id: number;
  ctId: string;
  name: string;
  coordinates?: {
    x: number;
    y: number;
  };
  lastOrderDate?: string;
  territory: Territory;
}
export interface NextVisit {
  time: string;
  frequencyCode: number;
  daySelector:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  bUSalesProfile: BUSalesProfileVisit;
}

export interface NextVisitPageResult extends PageResults<NextVisit> {}
