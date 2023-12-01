import { IncomingHttpHeaders } from 'http';

export interface IUrlBase {
  url: string;
  headers: IncomingHttpHeaders;
}
