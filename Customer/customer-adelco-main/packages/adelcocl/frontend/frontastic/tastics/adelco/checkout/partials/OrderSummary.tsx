import { numberToMoney } from 'helpers/mappers/cartMapper';
import Card from './Card';
import { CurrencyHelpers } from 'helpers/currencyHelpers';

const OrderSummary = ({ cart, mappedCart }) => {
  const amountOfProducts = cart?.lineItems?.reduce((accumulated, lineItem) => {
    return accumulated + lineItem.quantity;
  }, 0);

  const accumulatedDiscounts = cart?.lineItems
    .map((item) => item.lineDetails.discounts)
    .flat()
    .reduce((accumulator, discount) => {
      const existingDiscount = accumulator.find(
        (d) => d.description === discount.description
      );
      if (existingDiscount) {
        existingDiscount.amount += discount.amount;
      } else {
        accumulator.push({
          description: discount.description,
          amount: discount.amount
        });
      }
      return accumulator;
    }, []);

  return (
    <Card className="tablet:p-2 desktop:p-4">
      <h3 className="mb-4">Resumen de tu pedido</h3>
      <div className="flex flex-col gap-2 text-xs">
        <div className="mb-1 font-bold">
          {amountOfProducts} {amountOfProducts > 1 ? 'productos' : 'producto'}
        </div>
        <hr />
        <div className="flex justify-between">
          <span className="font-bold">Precio total</span>
          {mappedCart.subtotal}
        </div>
        <hr />
        {accumulatedDiscounts.length > 0 && (
          <>
            <div>
              <h4 className="mb-1 font-bold tablet:ml-4">Descuentos</h4>
              {accumulatedDiscounts.map((discount, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between gap-2 text-ellipsis text-corporative-02-hover"
                  >
                    <span className="ml-4 overflow-hidden text-ellipsis">
                      {discount.description}
                    </span>
                    <span>
                      {CurrencyHelpers.formatForCurrency(
                        numberToMoney(discount.amount || 0)
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            <hr />
          </>
        )}
        <div>
          <div className="mb-1 flex justify-between">
            <span className="font-bold">Neto total</span>
            <span>
              {CurrencyHelpers.formatForCurrency(
                numberToMoney(cart.totalDetails.netPrice || 0)
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Impuestos</span>
            <span>{mappedCart.totalTaxesAmount}</span>
          </div>
        </div>
        <hr />
        <div className="flex justify-between font-bold">
          <span className="text-sm">Total a pagar</span>
          <span>{mappedCart.totalPrice}</span>
        </div>
      </div>
    </Card>
  );
};

export default OrderSummary;
