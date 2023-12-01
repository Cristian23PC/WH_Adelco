import React, { useCallback, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Toaster, Spinner, Loader } from '@adelco/web-components';
import { appWithTranslation } from 'next-i18next';
import { FrontasticProvider } from 'frontastic';
import { ModalProvider } from '../contexts/modalContext';

import '../styles/app.css';
import '@adelco/web-components/dist/tailwind.css';
import Script from 'next/script';
import BackToTopButton from 'components/adelco/BackToTopButton';

interface AppPropsExtend extends AppProps {
  Component: any;
}

const LoaderTypeByURL = {
  '/': 'loader',
  '/checkout': 'spinner',
  '/cart': 'spinner',
  '/categorias': 'spinner',
  default: 'none'
};

const GenericLoader = ({ loaderType }) => {
  if (loaderType === LoaderTypeByURL['/']) {
    return <Loader className="!fixed" />;
  } else {
    return <Spinner className="!fixed" backdropClassName="!z-10" />;
  }
};

function FrontasticStarter({ Component, pageProps }: AppPropsExtend) {
  const router = useRouter();
  const [loaderType, setLoaderType] = React.useState(null);

  const routerChangeStart = useCallback((url) => {
    const normalizeUrl = url.match(/\/(\w+)?/)[0];
    setLoaderType(LoaderTypeByURL[normalizeUrl] || null);
  }, []);

  const routerChangeComplete = useCallback(() => {
    setLoaderType(null);
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', routerChangeStart);
    router.events.on('routeChangeComplete', routerChangeComplete);

    return () => {
      router.events.off('routeChangeStart', routerChangeStart);
      router.events.off('routeChangeComplete', routerChangeComplete);
    };
  });

  return (
    <FrontasticProvider>
      <ModalProvider>
        <Head>
          <title>Adelco</title>
          <meta name="robots" content="noindex,nofollow" />
          <link rel="manifest" href="/manifest.json" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
        </Head>

        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `
          }}
        />

        {/* Hotjar Tracking Code for front-customer-creation-request */}
        <Script
          id="adelco-hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          (function (h, o, t, j, a, r) {
            h.hj = h.hj || function () {(h['hj'].q = h['hj'].q || []).push(arguments);};
            h._hjSettings = {hjid: ${process.env.NEXT_PUBLIC_HOTJAR_ID}, hjsv: 6};
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.async = 1;
            r.src =t +h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
        `
          }}
        />

        <Component {...pageProps} />
        <Toaster />
        {!!loaderType && <GenericLoader loaderType={loaderType} />}
        <BackToTopButton />
      </ModalProvider>
    </FrontasticProvider>
  );
}

export default appWithTranslation(FrontasticStarter);
