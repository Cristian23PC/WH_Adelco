import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const useLoaderOnRoutes = (routes = []) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRouteChangeStart = useCallback(
    (url) => {
      if (!!routes.find((route) => url.startsWith(route))) {
        window.scrollTo(0, 0);
        setLoading(true);
      }
    },
    [routes]
  );

  const handleRouteChangeComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [loading]);

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [handleRouteChangeComplete, handleRouteChangeStart]);

  return {
    loading,
    setLoading
  };
};

export default useLoaderOnRoutes;
