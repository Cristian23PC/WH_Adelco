import React, { FC, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Order } from '@Types/cart/Order';
import Spinner from 'components/commercetools-ui/spinner';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import Image from 'frontastic/lib/image';

export interface Props {
  orders?: Order[];
}

const OrdersHistory: FC<Props> = ({ orders }) => {
  const [accountOrdersState, setAccountOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //account data
  const { orderHistory } = useCart();

  useEffect(() => {
    if (orderHistory) {
      orderHistory().then((data) => {
        setAccountOrders(data);
        setLoading(false);
      });
    } else {
      setAccountOrders(orders);
      setLoading(false);
    }
  }, [orders, orderHistory]);
  //18in messages
  const { formatMessage: formatAccountMessage } = useFormat({
    name: 'account'
  });
  const { formatMessage: formatProductMessage } = useFormat({
    name: 'product'
  });

  return (
    <div>
      <div className="mt-10">
        <div className="space-y-1">
          <h3 className="dark:text-light-100 text-lg font-medium leading-6 text-gray-900">
            {formatAccountMessage({
              id: 'orders.history',
              defaultMessage: 'My order history'
            })}
          </h3>
          <p className="max-w-2xl text-sm text-gray-500">
            {formatAccountMessage({
              id: 'orders.desc',
              defaultMessage:
                'Check the status of recent orders, manage returns, and download invoices.'
            })}
          </p>
        </div>
        <div className="divide-y divide-gray-200"></div>
        {loading ? (
          <div className="flex items-stretch justify-center px-12 py-10">
            <Spinner />
          </div>
        ) : accountOrdersState && accountOrdersState.length ? (
          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              Recent orders
            </h2>
            <div className="space-y-20">
              {accountOrdersState?.map((order) => (
                <div key={order.orderId}>
                  <h3 className="sr-only">
                    Order placed on{' '}
                    <time dateTime={order.email}>{order.email}</time>
                  </h3>
                  <div className="sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8 rounded-lg bg-gray-100 px-4 py-6">
                    <dl className="sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8 flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600">
                      <div className="sm:block sm:pt-0 flex justify-between pt-6">
                        <dt className="font-medium text-gray-900">
                          {formatAccountMessage({
                            id: 'orders.number',
                            defaultMessage: 'Order Number'
                          })}
                        </dt>
                        <dd className="sm:mt-1">{order.orderId}</dd>
                      </div>
                      <div className="sm:block sm:pt-0 flex justify-between pt-6 font-medium text-gray-900">
                        <dt>
                          {formatAccountMessage({
                            id: 'orders.total.amount',
                            defaultMessage: 'Total amount'
                          })}
                        </dt>
                        <dd className="sm:mt-1">
                          {(+order.sum.centAmount / 100).toFixed(2)}
                          {order.lineItems[0].price.currencyCode}
                        </dd>
                      </div>
                      <div className="sm:block sm:pt-0 flex justify-between pt-6 font-medium text-gray-900">
                        <dt>
                          {formatAccountMessage({
                            id: 'orders.status',
                            defaultMessage: 'Order status'
                          })}
                        </dt>
                        <dd className="sm:mt-1">{order.orderState}</dd>
                      </div>
                    </dl>
                    {/* <a
                      href={order.orderId}
                      className="mt-6 flex w-full items-center justify-center rounded-md border border-accent-400 bg-white py-2 px-4 text-sm font-medium text-accent-400 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto"
                    >
                      {formatAccountMessage({
                        id: 'orders.view.invoice',
                        defaultMessage: 'View invoice',
                      })}
                      <span className="sr-only">for order {order.orderId}</span>
                    </a> */}
                  </div>

                  <table className="sm:mt-6 mt-4 w-full text-gray-500">
                    <caption className="sr-only">
                      {formatProductMessage({
                        id: 'products',
                        defaultMessage: 'Products'
                      })}
                    </caption>
                    <thead className="sm:not-sr-only sr-only text-left text-sm text-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="dark:text-light-100 sm:w-2/5 lg:w-1/3 py-3 pr-8 font-normal"
                        >
                          {formatProductMessage({
                            id: 'product',
                            defaultMessage: 'Product'
                          })}
                        </th>
                        <th
                          scope="col"
                          className="dark:text-light-100 sm:table-cell hidden w-1/5 py-3 pr-8 font-normal"
                        >
                          {formatProductMessage({
                            id: 'price',
                            defaultMessage: 'Price'
                          })}
                        </th>
                        <th
                          scope="col"
                          className="dark:text-light-100 sm:table-cell hidden py-3 pr-8 font-normal"
                        >
                          {formatProductMessage({
                            id: 'size',
                            defaultMessage: 'Size'
                          })}
                        </th>
                        <th
                          scope="col"
                          className="dark:text-light-100 w-0 py-3 text-right font-normal"
                        >
                          {formatProductMessage({
                            id: 'product.info',
                            defaultMessage: 'Product information'
                          })}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="sm:border-t divide-y divide-gray-200 border-b border-gray-200 text-sm">
                      {order.lineItems.map((product) => (
                        <tr key={product.lineItemId}>
                          <td className="py-6 pr-8">
                            <div className="flex items-center">
                              <Image
                                src={product.variant.images[0]}
                                alt={product.name}
                                className="mr-6 h-16 w-16 rounded object-cover object-center"
                              />
                              <div>
                                <div className="dark:text-light-100 font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="dark:text-light-100 sm:hidden mt-1">
                                  {(product.price.centAmount / 100).toFixed(2)}
                                  {product.price.currencyCode}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="dark:text-light-100 sm:table-cell hidden py-6 pr-8">
                            {(product.price.centAmount / 100).toFixed(2)}
                            {product.price.currencyCode}
                          </td>
                          <td className="dark:text-light-100 sm:table-cell hidden py-6 pr-8">
                            {product.variant.attributes.size}
                          </td>
                          <td className="dark:text-light-100 whitespace-nowrap py-6 text-right font-medium">
                            <NextLink href={product._url || ''}>
                              <a className="text-accent-400">
                                {formatProductMessage({
                                  id: 'product.view',
                                  defaultMessage: 'View product'
                                })}
                                <span className="sr-only">
                                  , {product.name}
                                </span>
                              </a>
                            </NextLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <p className="mt-10 max-w-2xl text-sm text-gray-500">
            {formatAccountMessage({
              id: 'orders.no.orders',
              defaultMessage: 'You have not placed any orders yet! '
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;
