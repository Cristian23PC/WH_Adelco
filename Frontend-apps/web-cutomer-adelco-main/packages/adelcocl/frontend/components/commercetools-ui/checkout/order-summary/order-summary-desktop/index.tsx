import { useCallback } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { Cart } from '@Types/cart/Cart';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { StringHelpers } from 'helpers/stringHelpers';
import Image from 'frontastic/lib/image';

export interface Props {
  readonly cart: Cart;
  readonly editCartItem: () => void;
  readonly goToProductPage: (_url: string) => void;
  readonly removeCartItem: (lineItemId: string) => void;
  readonly selectedShipping: ShippingMethod;
  readonly someOutOfStock: boolean;
}

const DesktopOrderSummary = ({
  cart,
  editCartItem,
  goToProductPage,
  removeCartItem,
  selectedShipping,
  someOutOfStock,
}: Props) => {
  //i18n messages
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });
  const { formatMessage } = useFormat({ name: 'common' });

  const handleClick = useCallback(
    (url: string) => {
      goToProductPage(url);
    },
    [goToProductPage],
  );

  return (
    <section
      aria-labelledby="summary-heading"
      className="dark:bg-primary-400 lg:flex hidden w-full max-w-md flex-col bg-gray-50"
    >
      <h2 id="summary-heading" className="sr-only">
        {formatCartMessage({ id: 'order.summary', defaultMessage: 'Order summary' })}
      </h2>

      <ul role="list" className="flex-auto divide-y divide-gray-200 overflow-y-auto px-6">
        {cart.lineItems.map((lineItem, i) => (
          <li key={i} className="flex space-x-6 py-6">
            <Image
              src={lineItem.variant.images[0]}
              alt={lineItem.name}
              className="h-40 w-40 flex-none cursor-pointer rounded-md bg-gray-200 object-cover object-center"
              onClick={() => handleClick(lineItem._url)}
            />
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-1 text-sm font-medium">
                <h3
                  className="dark:text-light-100 cursor-pointer text-gray-900"
                  onClick={() => handleClick(lineItem._url)}
                >
                  {lineItem.name}
                </h3>
                <div className="flex space-x-4">
                  <p className="dark:text-light-100 text-gray-900">
                    {CurrencyHelpers.formatForCurrency(lineItem.price)}
                  </p>
                  {lineItem.count && <p className="dark:text-light-100 text-gray-900">{`x${lineItem.count}`}</p>}
                </div>
                {lineItem.variant.attributes?.color && (
                  <p className="dark:text-light-100 text-gray-500">
                    {StringHelpers.capitaliseFirstLetter(lineItem.variant.attributes.color.label)}
                  </p>
                )}
                {lineItem.variant.attributes?.size && (
                  <p className="dark:text-light-100 text-gray-500">
                    {StringHelpers.isNumeric(lineItem.variant.attributes.size)
                      ? lineItem.variant.attributes.size
                      : StringHelpers.capitaliseFirstLetter(lineItem.variant.attributes.size)}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={editCartItem}
                  className="text-accent-400 hover:text-accent-500 text-sm font-medium"
                >
                  {formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
                </button>
                <div className="flex border-l border-gray-300 pl-4">
                  <button
                    type="button"
                    onClick={() => removeCartItem(lineItem.lineItemId)}
                    className="text-accent-400 hover:text-accent-500 text-sm font-medium"
                  >
                    {formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {someOutOfStock && (
        <p className="flex items-center gap-1 p-6 text-xs text-red-500">
          <span style={{ marginBottom: '1px' }}>
            <ExclamationCircleIcon width={15} />
          </span>
          <span>{formatCheckoutMessage({ id: 'outOfStock', defaultMessage: 'Some products are out of stock' })}</span>
        </p>
      )}
      <div className="dark:bg-primary-400 sticky bottom-0 flex-none border-t border-gray-200 bg-gray-50 p-6">
        <dl className="dark:text-light-100 mt-8 space-y-6 text-sm font-medium text-gray-500">
          <div className="flex justify-between">
            <dt>{formatCheckoutMessage({ id: 'subtotal', defaultMessage: 'Subtotal' })}</dt>
            <dd className="dark:text-light-100 text-gray-900">
              {CurrencyHelpers.formatForCurrency(
                cart.lineItems.reduce(
                  (prev, current) =>
                    CurrencyHelpers.addCurrency(prev, CurrencyHelpers.multiplyCurrency(current.price, current.count)),
                  {
                    fractionDigits: cart.lineItems[0].price.fractionDigits,
                    centAmount: 0,
                    currencyCode: cart.lineItems[0].price.currencyCode,
                  },
                ),
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="flex">{formatCartMessage({ id: 'discounts', defaultMessage: 'Discounts' })}</dt>
            <dd className="dark:text-light-100 text-gray-900">
              {CurrencyHelpers.formatForCurrency(
                cart.lineItems.reduce(
                  (prev, current) =>
                    CurrencyHelpers.addCurrency(
                      prev,
                      CurrencyHelpers.subtractCurrency(
                        current.totalPrice,
                        CurrencyHelpers.multiplyCurrency(current.price, current.count),
                      ),
                    ),
                  {
                    fractionDigits: cart.lineItems[0].price.fractionDigits,
                    centAmount: 0,
                    currencyCode: cart.lineItems[0].price.currencyCode,
                  },
                ),
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>{formatCheckoutMessage({ id: 'shipping', defaultMessage: 'Shipping' })}</dt>
            <dd className="dark:text-light-100 text-gray-900">
              {CurrencyHelpers.formatForCurrency(selectedShipping?.rates?.[0]?.price || {})}
            </dd>
          </div>
          <div className="dark:text-light-100 flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
            <dt className="text-base">{formatCheckoutMessage({ id: 'total', defaultMessage: 'Total' })}</dt>
            <dd className="text-base">
              {CurrencyHelpers.formatForCurrency(
                CurrencyHelpers.addCurrency(cart.sum, selectedShipping?.rates?.[0]?.price || {}),
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default DesktopOrderSummary;
