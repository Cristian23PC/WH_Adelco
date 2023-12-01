import { useEffect, useState, FC } from 'react';
import {
  Button,
  TextField,
  Chip,
  toast,
  Spinner
} from '@adelco/web-components';
import Card from './Card';
import useAddCoupon from 'frontastic/actions/adelco/cart/useAddCoupon/useAddCoupon';
import useRemoveCoupon from 'frontastic/actions/adelco/cart/useRemoveCoupon/useRemoveCoupon';
import { DiscountCode } from '@Types/adelco/cart';

type CouponObject = {
  code: string;
  name: string;
};

type Props = {
  discountCodes: DiscountCode[];
  setCouponCode: (code: string) => void;
};

const ApplyButton = ({ onClick, disabled, isLoading }) => (
  <>
    <div className="flex h-12 items-center tablet:hidden">
      <Button
        variant="secondary"
        onClick={onClick}
        disabled={disabled}
        loading={isLoading}
      >
        Aplicar
      </Button>
    </div>
    <div className="hidden h-12 items-center tablet:flex">
      <Button
        variant="secondary"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        loading={isLoading}
      >
        Aplicar
      </Button>
    </div>
  </>
);

const CleanButton = ({ onClick }) => (
  <>
    <div className="flex h-12 items-center tablet:hidden">
      <Button variant="secondary" onClick={onClick}>
        Limpiar
      </Button>
    </div>
    <div className="hidden h-12 items-center tablet:flex">
      <Button variant="secondary" size="sm" onClick={onClick}>
        Limpiar
      </Button>
    </div>
  </>
);

const mapDiscounts = (discounts): CouponObject[] => {
  return discounts.map((discount) => ({
    code: discount.discountCode?.obj?.code,
    name: discount.discountCode?.obj?.name['es-CL']
  }));
};

const Coupon: FC<Props> = ({ discountCodes, setCouponCode }) => {
  const { trigger: addCoupon, isLoading: applyCouponLoading } = useAddCoupon();
  const { trigger: removeCoupon, isLoading: removeCouponLoading } =
    useRemoveCoupon();
  const [coupons, setCoupons] = useState<CouponObject[]>([]);
  const [couponField, setCouponField] = useState<string>('');
  const [couponFieldValid, setCouponFieldValid] = useState(true);

  useEffect(() => {
    setCoupons(mapDiscounts(discountCodes));
  }, [discountCodes]);

  const handleCouponFieldChange = (event) => {
    const { value } = event.target;
    setCouponField(value);
    if (!value) {
      setCouponFieldValid(true);
    }
  };

  const handleApplyCoupon = async () => {
    const exists = coupons.find((c) => couponField === c.code);
    if (!exists) {
      try {
        await addCoupon({ code: couponField });
        setCouponCode(couponField);
        setCouponField('');
      } catch (error) {
        setCouponFieldValid(false);
      }
    }
  };

  const handleCleanCoupon = () => {
    setCouponField('');
    setCouponFieldValid(true);
  };

  const handleRemoveCoupon = async ({ code }) => {
    try {
      await removeCoupon({ code });
      setCouponCode('');
    } catch (error) {
      toast.error({
        position: 'top-right',
        text: 'No se ha podido eliminar el descuento'
      });
    }
  };

  return (
    <>
      <Card className="flex flex-col gap-2.5">
        <h3>Cupón</h3>
        <div className="flex justify-between gap-2.5">
          <span className="w-full">
            <TextField
              placeholder="Ingresa el código"
              value={couponField}
              onChange={handleCouponFieldChange}
              helperText={
                !couponFieldValid && Boolean(couponField)
                  ? 'Código de cupón inválido'
                  : undefined
              }
              variant={
                !couponFieldValid && Boolean(couponField) ? 'failure' : 'none'
              }
              helperIcon={
                !couponFieldValid && Boolean(couponField) ? 'error' : undefined
              }
            />
          </span>
          {!couponFieldValid ? (
            <CleanButton onClick={handleCleanCoupon} />
          ) : (
            <ApplyButton
              onClick={handleApplyCoupon}
              disabled={Boolean(!couponField)}
              isLoading={applyCouponLoading}
            />
          )}
        </div>
        {coupons?.map((coupon, index) => (
          <div key={index}>
            <Chip
              label={coupon.name}
              onClose={() => handleRemoveCoupon(coupon)}
            />
          </div>
        ))}
      </Card>
      {removeCouponLoading && <Spinner className="!fixed" />}
    </>
  );
};

export default Coupon;
