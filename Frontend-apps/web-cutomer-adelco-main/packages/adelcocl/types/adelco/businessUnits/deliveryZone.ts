import { Region } from './region';

export interface DeliverZone extends Region {
  id: string;
  commune: string;
  dcCode: string;
  dcLabel: string;
  dchDefault?: string;
}
