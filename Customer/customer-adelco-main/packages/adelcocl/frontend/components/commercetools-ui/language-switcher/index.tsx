import React, { Fragment } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { formatLocaleName } from 'helpers/utils/formatLocaleName';

interface Props {
  className: string;
}

const LanguageSwitcher: React.FC<Props> = ({ className }) => {
  const router = useRouter();

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <Menu>
        <div>
          <Menu.Button className="dark:shadow-3xl dark:bg-primary-400 dark:text-light-100 z-50 inline-flex w-full justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none">
            {router?.locale && formatLocaleName(router?.locale)}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="dark:shadow-3xl dark:bg-primary-400 dark:text-light-100 absolute bottom-4 left-28 right-0 z-50 mt-2 w-full origin-top-right rounded-md shadow-sm ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
              {router?.locales.map((locale, index) => (
                <Menu.Item key={index}>
                  <NextLink href={router?.asPath} locale={locale}>
                    <a className="block px-4 py-2 text-center text-sm hover:bg-gray-300 dark:hover:bg-gray-600 ">
                      {formatLocaleName(locale)}
                    </a>
                  </NextLink>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
