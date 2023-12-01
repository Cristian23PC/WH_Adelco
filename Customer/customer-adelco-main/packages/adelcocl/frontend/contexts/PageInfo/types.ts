import { GetServerSidePropsContext } from 'next';

export interface PageInfo {
  params: GetServerSidePropsContext['params'];
  query: GetServerSidePropsContext['query'];
  referrer: string;
  locale: string;
}
