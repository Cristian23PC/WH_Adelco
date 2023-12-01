import React, { useCallback, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Toaster, Spinner } from 'am-ts-components';
import { appWithTranslation } from 'next-i18next';
import { FrontasticProvider } from 'frontastic';

import '../styles/app.css';
import 'am-ts-components/dist/adelco.css';

function FrontasticStarter({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const startLoader = useCallback(() => setLoading(true), []);
  const endLoader = useCallback(() => setLoading(false), []);

  useEffect(() => {
    router.events.on('routeChangeStart', startLoader);
    router.events.on('routeChangeComplete', endLoader);

    return () => {
      router.events.off('routeChangeStart', startLoader );
      router.events.off('routeChangeComplete', endLoader );
    }
  });

  // if(loading) {
  //   return <Spinner />
  // }

  return (
    <FrontasticProvider>
      <Head>
        <title>Adelco</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </FrontasticProvider>
  );
}

export default appWithTranslation(FrontasticStarter);
