import { AdelcoError } from '@Types/adelco/general';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import useUser from '../../user/useUser';
import useCart from '../useCart';
import { useState } from 'react';

const KEY = '/action/cart/setLineItemQuantity';
const ANONYMOUS_KEY = '/action/anonymousCart/setLineItemQuantity';

export enum ERROR_CODES {
  MISSING_STOCK = 'Carts-026'
}

type LineItem = {
  id: string;
  quantity: number;
};

const useSetLineItemQuantity = () => {
  const { mutateCart } = useCart();
  const { isLoading, user } = useUser();
  const [lastItem, setLastItem] = useState<null | LineItem>(null);
  const cartKey = !isLoading && (!user.loggedIn ? ANONYMOUS_KEY : KEY);
  const { trigger, error, isMutating } = useSWRMutation<
    unknown,
    AdelcoError,
    string,
    LineItem
  >(
    cartKey,
    (url, { arg }) => {
      setLastItem(arg);
      return fetchApiHub(url, {
        body: JSON.stringify(arg),
        method: 'POST'
      });
    },
    {
      onSuccess: mutateCart
    }
  );

  const handleChangeQuantityError = async (
    id: string,
    currentQuantity: number,
    error: any
  ) => {
    const { code: errorCode, meta: errorData } = error?.error || {};
    const availableQuantity = errorData?.availableQuantity;
    const shouldRetry =
      errorCode === ERROR_CODES.MISSING_STOCK && availableQuantity;
    const response = {
      error: true,
      quantity: currentQuantity,
      showStockWarning: false
    };

    if (shouldRetry) {
      try {
        if (availableQuantity !== currentQuantity) {
          await trigger({ id, quantity: availableQuantity });
        }
        response.quantity = availableQuantity;
        response.showStockWarning = true;
      } catch {}
    }

    return response;
  };

  const handleTrigger = async ({
    id,
    quantity,
    currentQuantity
  }: {
    id: string;
    quantity: number;
    currentQuantity: number;
  }) => {
    try {
      await trigger({ id, quantity });
    } catch (e) {
      return handleChangeQuantityError(id, currentQuantity, e);
    }
  };

  return {
    trigger: handleTrigger,
    error,
    isLoading: isMutating,
    lastItem
  };
};

export default useSetLineItemQuantity;
