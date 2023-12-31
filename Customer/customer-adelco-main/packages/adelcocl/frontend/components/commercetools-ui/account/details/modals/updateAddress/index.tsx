import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Address } from '@Types/account/Address';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAccount, useDarkMode } from 'frontastic';

export interface UpdateAddressProps {
  open?: boolean;
  onClose?: () => void;
  addressId?: string;
  defaultValues: Partial<Address>;
}

const UpdateAddress: React.FC<UpdateAddressProps> = ({
  open,
  onClose,
  defaultValues
}) => {
  //Darkmode
  const { mode } = useDarkMode();

  //i18n messages
  const { formatMessage: formatAccountMessage } = useFormat({
    name: 'account'
  });
  const { formatMessage } = useFormat({ name: 'common' });

  //account data
  const { updateAddress } = useAccount();

  //updated address data
  const [data, setData] = useState(defaultValues as Address);

  //input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //checkbox change handler
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.checked });
  };

  //submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateAddress(data);
    } catch (err) {
    } finally {
      onClose();
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        className={`${mode} fixed inset-0 z-10 overflow-y-auto`}
        onClose={onClose}
      >
        <>
          <div className="sm:block sm:p-0 flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-left">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="sm:inline-block sm:h-screen sm:align-middle hidden"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="absolute inset-0" onClick={onClose}>
                {/* eslint-disable */}
                <div
                  className="dark:bg-primary-200 sm:px-6 lg:py-24 lg:px-8 absolute left-1/2 top-1/2 h-[90vh] w-[90%] max-w-[800px] -translate-x-1/2 -translate-y-1/2 overflow-auto bg-white px-4 py-16"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-enable */}
                  <div className="relative mx-auto max-w-xl">
                    <div className="text-center">
                      <h2 className="dark:text-light-100 sm:text-4xl text-3xl font-extrabold tracking-tight text-gray-900">
                        {formatAccountMessage({
                          id: 'address.update.headline',
                          defaultMessage: 'Update Address'
                        })}
                      </h2>
                      <p className="mt-4 text-lg leading-6 text-gray-400">
                        {formatAccountMessage({
                          id: 'address.update.desc',
                          defaultMessage: 'Update your associated address here'
                        })}
                        ;
                      </p>
                    </div>
                    <div className="mt-12">
                      <form
                        onSubmit={handleSubmit}
                        className="sm:grid-cols-2 sm:gap-x-8 grid grid-cols-1 gap-y-6"
                      >
                        <div>
                          <label
                            htmlFor="first-name"
                            className="dark:text-light-100 block text-sm font-medium text-gray-700"
                          >
                            {formatMessage({
                              id: 'firstName',
                              defaultMessage: 'First Name'
                            })}
                          </label>
                          <div className="mt-1">
                            <input
                              required
                              type="text"
                              name="firstName"
                              id="first-name"
                              autoComplete="given-name"
                              className="focus:border-accent-400 focus:ring-accent-400 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm"
                              onChange={handleChange}
                              defaultValue={defaultValues.firstName}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="last-name"
                            className="dark:text-light-100 block text-sm font-medium text-gray-700"
                          >
                            {formatMessage({
                              id: 'lastName',
                              defaultMessage: 'Last Name'
                            })}
                          </label>
                          <div className="mt-1">
                            <input
                              required
                              type="text"
                              name="lastName"
                              id="last-name"
                              autoComplete="family-name"
                              className="focus:border-accent-400 focus:ring-accent-400 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm"
                              onChange={handleChange}
                              defaultValue={defaultValues.lastName}
                            />
                          </div>
                        </div>
                        <div className="">
                          <label
                            htmlFor="street-number"
                            className="dark:text-light-100 block text-sm font-medium text-gray-700"
                          >
                            {formatMessage({
                              id: 'street.number',
                              defaultMessage: 'Street Number'
                            })}
                          </label>
                          <div className="mt-1">
                            <input
                              required
                              type="text"
                              name="streetNumber"
                              id="street-number"
                              className="focus:border-accent-400 focus:ring-accent-400 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm"
                              onChange={handleChange}
                              defaultValue={defaultValues.streetNumber}
                            />
                          </div>
                        </div>
                        <div className="">
                          <label
                            htmlFor="street-name"
                            className="dark:text-light-100 block text-sm font-medium text-gray-700"
                          >
                            {formatMessage({
                              id: 'street.name',
                              defaultMessage: 'Street Name'
                            })}
                          </label>
                          <div className="mt-1">
                            <input
                              required
                              id="street-name"
                              name="streetName"
                              type="text"
                              autoComplete="address-line1"
                              className="focus:border-accent-400 focus:ring-accent-400 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm"
                              onChange={handleChange}
                              defaultValue={defaultValues.streetName}
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="phone"
                            className="dark:text-light-100 block text-sm font-medium text-gray-700"
                          >
                            {formatMessage({
                              id: 'phone',
                              defaultMessage: 'Phone'
                            })}
                          </label>
                          <div className="mt-1">
                            <input
                              required
                              type="text"
                              name="phone"
                              id="phone"
                              autoComplete="tel"
                              className="focus:border-accent-400 focus:ring-accent-400 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm"
                              onChange={handleChange}
                              defaultValue={defaultValues.phone}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="postal-code"
                            className="dark:text-light-100 block text-sm font-medium text-gray-700"
                          >
                            {formatMessage({
                              id: 'zipCode',
                              defaultMessage: 'Postal Code'
                            })}
                          </label>
                          <div className="mt-1">
                            <input
                              required
                              type="text"
                              name="postalCode"
                              id="postal-code"
                              autoComplete="postal-code"
                              className="focus:border-accent-400 focus:ring-accent-400 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm"
                              onChange={handleChange}
                              defaultValue={defaultValues.postalCode}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="city"
                            className="dark:text-light-100 block text-sm font-medium text-gray-700"
                          >
                            {formatMessage({
                              id: 'city',
                              defaultMessage: 'City'
                            })}
                          </label>
                          <div className="mt-1">
                            <input
                              required
                              type="text"
                              name="city"
                              id="city"
                              autoComplete="country"
                              className="focus:border-accent-400 focus:ring-accent-400 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm"
                              onChange={handleChange}
                              defaultValue={defaultValues.city}
                            />
                          </div>
                        </div>
                        {!defaultValues.isDefaultShippingAddress && (
                          <div>
                            <legend className="sr-only">
                              {formatAccountMessage({
                                id: 'address.setDefault.delivery',
                                defaultMessage:
                                  'Set as default delivery address'
                              })}
                            </legend>
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="is-default-shipping-address"
                                  aria-describedby="Set as default shipping address"
                                  name="isDefaultShippingAddress"
                                  type="checkbox"
                                  className="focus:ring-accent-400 h-6 w-6 rounded border-gray-300 text-white"
                                  onChange={handleCheckboxChange}
                                  defaultChecked={
                                    defaultValues.isDefaultShippingAddress
                                  }
                                />
                              </div>
                              <div className="ml-3 text-base">
                                <label
                                  htmlFor="is-default-shipping-address"
                                  className="text-gray-400"
                                >
                                  {formatAccountMessage({
                                    id: 'address.setDefault.delivery',
                                    defaultMessage:
                                      'Set as default delivery address'
                                  })}
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                        {!defaultValues.isDefaultBillingAddress && (
                          <div>
                            <legend className="sr-only">
                              {formatAccountMessage({
                                id: 'address.setDefault.billing',
                                defaultMessage: 'Set as default billing address'
                              })}
                            </legend>
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="is-default-billing-address"
                                  aria-describedby="Set as default billing addaress"
                                  name="isDefaultBillingAddress"
                                  type="checkbox"
                                  className="focus:ring-accent-400 h-6 w-6 rounded border-gray-300 text-white"
                                  onChange={handleCheckboxChange}
                                  defaultChecked={
                                    defaultValues.isDefaultBillingAddress
                                  }
                                />
                              </div>
                              <div className="ml-3 text-base">
                                <label
                                  htmlFor="is-default-billing-address"
                                  className="text-gray-400"
                                >
                                  {formatAccountMessage({
                                    id: 'address.setDefault.billing',
                                    defaultMessage:
                                      'Set as default billing address'
                                  })}
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="sm:col-span-2 text-center">
                          <p className="mt-4 text-lg leading-6 text-gray-400">
                            {formatAccountMessage({
                              id: 'address.create.safety',
                              defaultMessage:
                                'All the personal associated to your account is safely stored in our database, and we will not share it with third parties.'
                            })}
                          </p>
                        </div>
                        <div className="sm:col-span-2 sm:gap-8 mt-4 flex gap-4">
                          <button
                            type="button"
                            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gray-400 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors duration-200 ease-out hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            onClick={onClose}
                          >
                            {formatMessage({
                              id: 'cancel',
                              defaultMessage: 'Cancel'
                            })}
                          </button>
                          <button
                            type="submit"
                            className="bg-accent-400 hover:bg-accent-500 focus:ring-accent-400 inline-flex w-full items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2"
                          >
                            {formatMessage({
                              id: 'save',
                              defaultMessage: 'Save'
                            })}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </>
      </Dialog>
    </Transition.Root>
  );
};

export default UpdateAddress;
