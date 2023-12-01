import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, Redirect } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { createClient, ResponseError, LocaleStorage } from 'frontastic';
import { FrontasticRenderer } from 'frontastic/lib/renderer';
import { tastics } from 'frontastic/tastics';
import styles from './slug.module.css';
import { Log } from '../helpers/errorLogger';
import useTrackPageView from 'helpers/hooks/analytics/useTrackPageView';
import { PageInfoContext } from 'contexts/PageInfo/PageInfoContext';
import { PageInfo } from 'contexts/PageInfo/types';

type SlugProps = {
  // This needs an overhaul. Can be too many things in my opinion (*Marcel)
  // eslint-disable-next-line
  data: any;
  // data: RedirectResponse | PageDataResponse | ResponseError | { ok: string; message: string } | string;
  locale: string;
  pageInfo: PageInfo;
};

export default function Slug({ data, locale, pageInfo }: SlugProps) {
  LocaleStorage.locale = locale;
  useTrackPageView(pageInfo);

  if (!data || typeof data === 'string') {
    return (
      <>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
          Internal Error
        </h1>
        <p className="mt-2 text-lg">{data}</p>
        <p className="mt-2 text-lg">
          Check the logs of your Frontastic CLI for more details.
        </p>
      </>
    );
  }

  if (!data?.ok && data?.message) {
    return (
      <>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
          Internal Error
        </h1>
        <p className="mt-2 text-lg">{data.message}</p>
        <p className="mt-2 text-lg">
          Check the logs of your Frontastic CLI for more details.
        </p>
      </>
    );
  }

  return (
    <PageInfoContext.Provider value={pageInfo}>
      <FrontasticRenderer
        data={data}
        tastics={tastics}
        wrapperClassName={styles.gridWrapper}
      />
    </PageInfoContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps | Redirect = async ({
  params,
  locale,
  query,
  req,
  res
}) => {
  const frontastic = createClient();
  const data = await frontastic.getRouteData(params, locale, query, req, res);

  if (data) {
    if (data instanceof ResponseError && data.getStatus() == 404) {
      return {
        notFound: true
      };
    } else if (typeof data === 'object' && 'target' in data) {
      return {
        redirect: {
          destination: data.target,
          statusCode: data.statusCode
        } as Redirect
      };
    }
  }

  if (data instanceof Error) {
    // @TODO: Render nicer error page in debug mode, which shows the error to
    // the developer and also outlines how to debug this (take a look at
    // frontastic-CLI).
    Log.error('Error retrieving data: ', data);
    return {
      notFound: true
    };
  }

  if (typeof data === 'string') {
    return {
      props: {
        data: { error: data },
        error: data
      }
    };
  }

  return {
    props: {
      data: data || null,
      pageInfo: {
        params,
        query,
        locale,
        referrer: req?.headers?.referer || ''
      },
      locale: locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'cart',
        'product',
        'checkout',
        'account',
        'error',
        'success',
        'wishlist',
        'newsletter'
      ]))
    }
  };
};
