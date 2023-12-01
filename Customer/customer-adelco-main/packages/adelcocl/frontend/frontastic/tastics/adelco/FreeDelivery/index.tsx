import React from 'react';
import { CheckoutFeedback } from '@adelco/web-components';
import useUser from 'frontastic/actions/adelco/user/useUser';

const FreeDeliveryTastic = () => {
  const { user } = useUser();
  const MIN_AMOUNT = user?.minAmount?.centAmount ?? 40000;
  const message = `Monto mínimo de compra ${MIN_AMOUNT.toLocaleString('es-CL', {
    style: 'currency',
    currency: user?.minAmount?.currencyCode ?? 'CLP',
    minimumFractionDigits: user?.minAmount?.fractionDigits ?? 0
  })}`;

  return (
    <div className="flex justify-center px-4 py-2 tablet:px-6 tablet:py-4 desktop:px-0">
      <div className="w-full desktop:max-w-[886px]">
        <CheckoutFeedback
          variant="info"
          title="Despacho gratis"
          message={message}
        />
      </div>
    </div>
  );
};

export default FreeDeliveryTastic;
