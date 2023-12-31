import React, { Fragment, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/outline';
import { Account } from '@Types/account/Account';
import Typography from 'components/commercetools-ui/typography';
import { headerNavigation } from 'helpers/mocks/mockData';
import { Reference, ReferenceLink } from 'helpers/reference';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';
import DarkModeWidget from '../darkmode-widget';
import AccountButton from './account-button';
import CartButton from './cart-button';
import HeaderMenu from './header-menu';
import MegaMenuContent from './mega-menu-content';
import SearchButton from './search-button';
import WishListButton from './wishlist-button';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export interface Link {
  name: string;
  reference: Reference;
}

export interface HeaderProps {
  tagline?: string;
  links: Link[];
  cartItemCount: number;
  wishlistItemCount?: number;
  logo: { media: NextFrontasticImage } | NextFrontasticImage;
  logoLink: Reference;
  account: Account;
  accountLink: Reference;
  wishlistLink?: Reference;
  cartLink: Reference;
}

const Header: React.FC<HeaderProps> = ({
  tagline,
  links,
  cartItemCount,
  wishlistItemCount,
  logo,
  logoLink,
  account,
  accountLink,
  wishlistLink,
  cartLink,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed-screen-width lg:relative-width">
      {/* Mobile menu */}
      <HeaderMenu open={open} setOpen={setOpen} links={links} navigation={headerNavigation} />

      <header className="relative">
        {tagline && (
          <p className="bg-primary-400 sm:px-6 lg:px-8 flex items-center justify-center px-4 text-sm font-medium text-white">
            <Typography>{tagline}</Typography>
          </p>
        )}

        <nav aria-label="Top" className="lg:px-4 mx-auto max-w-full border-b border-gray-200 px-6">
          {/* Secondary navigation */}
          <div className="h-full">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <ReferenceLink target={logoLink} className="md:py-3 flex h-full items-center py-4 pr-2">
                <span className="sr-only">Catwalk</span>
                <div className="sm:w-[120px] sm:pr-7 relative mr-4 h-8 w-[70px] px-4 pr-3">
                  <Image
                    media={logo.media ? logo.media : { media: {} }}
                    className="dark:invert"
                    layout="fill"
                    objectFit="contain"
                    alt="Logo"
                  />
                </div>
              </ReferenceLink>

              <div className="lg:hidden flex flex-1 items-center">
                <button
                  type="button"
                  className="text-primary-400 dark:text-light-100 -ml-2 rounded-md bg-none p-2"
                  onClick={() => setOpen(!open)}
                >
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Mega menus */}
              <Popover.Group className="lg:block lg:flex-1 lg:self-stretch hidden">
                <div className="flex h-full space-x-8">
                  {headerNavigation.categories.map((category, categoryIdx) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? 'border-indigo-600 text-indigo-600'
                                  : 'border-transparent text-gray-700 hover:text-gray-800',
                                'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out',
                              )}
                            >
                              <Typography>{category.name}</Typography>
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="sm:text-sm absolute inset-x-0 top-full z-10 text-gray-500">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                              <MegaMenuContent category={category} categoryIdx={categoryIdx} />
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {links.map((link, id) => (
                    <ReferenceLink
                      key={id}
                      target={link.reference}
                      className="text-primary-400 hover:text-primary-500 dark:text-light-100 flex items-center text-base font-medium"
                    >
                      <Typography>{link.name}</Typography>
                    </ReferenceLink>
                  ))}
                </div>
              </Popover.Group>

              <div className="flex flex-1 items-center justify-end">
                <div className="flex w-fit items-center">
                  <DarkModeWidget className="text-primary-400 hover:text-primary-500 dark:text-light-100 mr-4" />
                  <SearchButton />
                  <AccountButton account={account} accountLink={accountLink} />

                  <span className="lg:mx-4 mx-4 h-6 w-px bg-gray-200" aria-hidden="true" />

                  <WishListButton wishlistItemCount={wishlistItemCount} wishlistLink={wishlistLink} />
                  <CartButton cartItemCount={cartItemCount} cartLink={cartLink} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
