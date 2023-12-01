import React, { useEffect, useMemo, useRef, useState } from 'react';
import useCart from '../../../actions/adelco/cart/useCart/useCart';
import { ctCartToCart } from 'helpers/mappers/cartMapper';
import { Button, Icon, Spinner, toast, Modal } from '@adelco/web-components';
import Link from 'next/link';
import OrderSummary from './partials/OrderSummary';
import Coupon from './partials/Coupon';
import PaymentMethod from './partials/PaymentMethod';
import ShippingInformation from './partials/ShippingInformation';
import Comment from './partials/Comment';
import FixedFooter from './partials/FixedFooter';
import useCreateOrder from 'frontastic/actions/adelco/orders/useCreateOrder';
import { useRouter } from 'next/router';
import useUser from 'frontastic/actions/adelco/user/useUser';
import { CtDiscount } from '@Types/adelco/product';
import useTrackCheckout from 'helpers/hooks/analytics/useTrackCheckout';
import useDeliveryDates from 'frontastic/actions/adelco/cart/useDeliveryDates';
import { formatDeliveryDates, getEarlyDateItem } from 'helpers/utils/date';

const CheckoutTastic = ({ data }) => {
  const router = useRouter();
  const { trackViewCheckout, trackPurchase, trackPurchaseFailed } =
    useTrackCheckout();
  const isCheckoutTracked = useRef<boolean>(false);
  const { user } = useUser();
  const { trigger: createOrder, isLoading } = useCreateOrder();
  const { deliveryDates } = useDeliveryDates();
  const [addComment, setAddComment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [comment, setComment] = useState('');
  const { cart } = useCart();
  const DELIVERY_MIN_AMOUNT = user?.minAmount?.centAmount ?? 50000;
  const warningMessage = `Agrega más productos para alcanzar el monto mínimo de ${DELIVERY_MIN_AMOUNT.toLocaleString(
    'es-CL',
    {
      style: 'currency',
      currency: user?.minAmount?.currencyCode ?? 'CLP',
      minimumFractionDigits: user?.minAmount?.fractionDigits ?? 0
    }
  )}`;
  const [totalPrice, setTotalPrice] = useState(
    cart?.totalDetails?.grossPrice ?? 0
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [canCreateOrder, setCanCreateOrder] = useState<boolean>(
    totalPrice >= DELIVERY_MIN_AMOUNT
  );
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (user && cart && !isCheckoutTracked.current) {
      const discounts: CtDiscount[] = cart.totalDetails?.discounts || [];
      const cartTotalDiscounts = discounts?.reduce(
        (acc: number, discount: CtDiscount) => acc + discount.amount,
        0
      );

      const cartData = {
        businessUnitId: user?.businessUnitId,
        deliveryZone: user?.zoneLabel,
        cartTotalQuantityOfItems: cart?.totalLineItemQuantity,
        cartNetTotal: cart?.totalDetails?.netPrice,
        cartTotalDiscounts: cartTotalDiscounts,
        cartTotalAmount: cart?.totalDetails?.grossPrice
      };

      trackViewCheckout(cartData);
      isCheckoutTracked.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cart]);

  useEffect(() => {
    if (cart?.totalDetails?.grossPrice) {
      setTotalPrice(cart?.totalDetails?.grossPrice);
      const canCreate = cart?.totalDetails?.grossPrice >= DELIVERY_MIN_AMOUNT;
      setCanCreateOrder(canCreate);

      if (!canCreate) {
        setModalOpen(true);
      }
    }
  }, [cart, DELIVERY_MIN_AMOUNT, user, paymentMethod]);

  const mappedCart = useMemo(() => {
    if (!cart) return null;
    // TODO: cart might be an object but not the expected cart. Ticket: FP-890
    return ctCartToCart(cart);
  }, [cart]);

  const earlyDeliveryDate =
    deliveryDates?.length && getEarlyDateItem(deliveryDates);
  const deliveryDateFormatted = earlyDeliveryDate
    ? formatDeliveryDates(earlyDeliveryDate)
    : '';

  if (!mappedCart) {
    return <Spinner className="!fixed" />;
  }

  if (cart.lineItems.length === 0) {
    return;
  }

  const handleChangePaymentMethod = (
    method: string,
    displayAlert: boolean = true
  ) => {
    setPaymentMethod(method);
    displayAlert &&
      toast.success({
        iconName: 'done',
        text: 'Método de pago actualizado',
        position: 'top-right'
      });
  };

  const handleCreateOrder = async () => {
    const purchaseTrackInfo = {
      cart: mappedCart,
      deliveryDate: deliveryDateFormatted,
      paymentMethod,
      couponCode
    };
    try {
      const order = await createOrder({
        paymentMethod,
        source: 'ecomm',
        customerComment: comment
      });

      trackPurchase({
        ...purchaseTrackInfo,
        user,
        order
      });
      router.push('/order-confirmation');
    } catch (e) {
      const errorCode = e?.error?.code || e?.error?.message || 'unknown';
      trackPurchaseFailed(purchaseTrackInfo, errorCode);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-156px)] bg-page px-4 pb-20 pt-5 text-corporative-03 tablet:min-h-[calc(100vh-61px)]">
        <div className="mx-auto flex w-full max-w-[886px] flex-col gap-4">
          <Link href="/cart">
            <span className="flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold">
              <Icon name="arrow_s_left" />
              <span className="underline">Carro de compra</span>
            </span>
          </Link>

          <h2 className="font-bold">Orden</h2>
          <div className="flex w-full flex-col gap-4 tablet:mx-auto tablet:flex-row-reverse">
            <div className="grow-0 tablet:w-[229px] desktop:w-[317px]">
              <OrderSummary cart={cart} mappedCart={mappedCart} />
              <div className="mt-4 hidden tablet:block">
                <Button
                  onClick={handleCreateOrder}
                  loading={isLoading}
                  disabled={isLoading || !canCreateOrder || !paymentMethod}
                  size="sm"
                  block
                >
                  Crear pedido
                </Button>
              </div>
            </div>

            <div className="flex shrink-0 grow flex-col gap-4 tablet:min-w-[443px]">
              <Coupon
                discountCodes={cart.discountCodes}
                setCouponCode={setCouponCode}
              />
              <PaymentMethod
                onChange={handleChangePaymentMethod}
                value={paymentMethod}
              />
              <ShippingInformation
                shippingAddress={user.zoneLabel}
                deliveryDate={deliveryDateFormatted}
              />
              <Comment
                setAddComment={setAddComment}
                addComment={addComment}
                setComment={setComment}
                comment={comment}
              />
            </div>
          </div>
        </div>
        <FixedFooter
          onClick={handleCreateOrder}
          isLoading={isLoading}
          disabled={isLoading || !canCreateOrder}
        />
      </div>
      <Modal
        id="minimum-purchase-amount-modal"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex flex-col gap-8">
          <h3 className="text-base font-bold">
            No cumples con el monto mínimo de compra
          </h3>
          <p className="text-sm">{warningMessage}</p>
          <div className="w-full">
            <Link href="/">
              <>
                <Button
                  variant="secondary"
                  size={'md'}
                  block
                  className="block tablet:hidden"
                  onClick={() => router.push('/')}
                >
                  Agregar más productos
                </Button>
                <Button
                  variant="secondary"
                  size={'sm'}
                  block
                  className="hidden tablet:block"
                  onClick={() => router.push('/')}
                >
                  Agregar más productos
                </Button>
              </>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CheckoutTastic;
