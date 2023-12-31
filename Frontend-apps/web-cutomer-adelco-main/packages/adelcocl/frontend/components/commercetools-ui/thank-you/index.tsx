import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAdyen } from 'frontastic';
import Image from 'frontastic/lib/image';

const ThankYou = () => {
  //i18n messages
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });

  const { adyenCheckout } = useAdyen();
  const router = useRouter();

  useEffect(() => {
    const { sessionId, redirectResult } = router.query;

    adyenCheckout(sessionId, redirectResult);
  }, []);

  return (
    <main className="lg:min-h-full relative">
      <div className="lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12 h-80 overflow-hidden">
        <Image
          src="https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg"
          alt="TODO"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div>
        <div className="sm:py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:py-32 lg:px-8 xl:gap-x-24 mx-auto max-w-2xl py-16 px-4">
          <div className="lg:col-start-2">
            <p className="dark:text-light-100 sm:text-5xl mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
              {formatCheckoutMessage({ id: 'order.thanks', defaultMessage: 'Thanks for ordering' })}
            </p>
            <p className="dark:text-light-100 mt-2 text-base text-gray-500">
              {formatCheckoutMessage({
                id: 'order.appreciate',
                defaultMessage:
                  ' We appreciate your order, we’re currently processing it. So hang tight and we’ll send you confirmation very soon!',
              })}
            </p>

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <p
                className="text-accent-400 hover:text-accent-500 cursor-pointer text-sm font-medium"
                onClick={() => router.push('/')}
              >
                {formatCheckoutMessage({ id: 'continueShopping', defaultMessage: 'Continue Shopping' })}
                <span aria-hidden="true"> &rarr;</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
