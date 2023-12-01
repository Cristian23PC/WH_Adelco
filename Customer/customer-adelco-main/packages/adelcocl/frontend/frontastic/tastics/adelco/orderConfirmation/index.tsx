import React from 'react';
import { Button } from '@adelco/web-components';
import { useRouter } from 'next/router';
import OrderConfirmationIcon from './partials/OrderConfirmationIcon';

const OrderConfirmationTastic = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className="mx-auto mt-20 flex max-w-[288px] flex-col justify-center gap-8 text-center text-corporative-03">
      <div className="flex justify-center">
        <OrderConfirmationIcon />
      </div>
      <h2 className="font-semibold">¡Gracias por elegir Adelco!</h2>
      <p className="text-sm">
        Tu pedido se está procesando, te enviaremos un correo de confirmación.
      </p>
      <div className="flex justify-center tablet:hidden">
        <Button onClick={handleClick} variant="secondary" size="md">
          <span className="px-8">Aceptar</span>
        </Button>
      </div>
      <div className="hidden justify-center tablet:flex">
        <Button onClick={handleClick} variant="secondary" size="sm">
          <span className="px-2">Aceptar</span>
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationTastic;
