import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EmailPassword } from '@Types/adelco/user';
import { Navbar, LoginModal } from 'am-ts-components';
// eslint-disable-next-line import/no-unresolved
import useCart from 'frontastic/actions/adelco/cart/useCart';
import useLogin from 'frontastic/actions/adelco/user/useLogin';
import useUser from 'frontastic/actions/adelco/user/useUser/useUser';
import useLocalStorage from '../../../../helpers/hooks/useLocalStorage';
import { categoryMapper } from '../../../../helpers/mappers/categoryMapper';
import ZoneSelector from '../zoneSelector';

const linkRenderer = (link, label) => <Link href={link}>{label}</Link>;
const ActiveLink = ({ href, children }) => {
  const { asPath } = useRouter();

  const activeClassName = asPath === href ? 'bg-corporative-01-hover' : '';

  return linkRenderer(href, <div className={activeClassName}>{children}</div>);
};

export const categoryLinkRenderer = (link, label) => <ActiveLink href={`/category/${link}`}>{label}</ActiveLink>;

const Header = ({ data }) => {
  const router = useRouter();
  const { user } = useUser(data?.user?.dataSource);

  const { trigger } = useLogin();
  const { cart } = useCart();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  const [searchedTerms, setSearchedTerms] = useLocalStorage('lastSearchedTerms', []);
  const menuData = useMemo(() => categoryMapper(data.data.dataSource.categories), [data.data.dataSource.categories]);

  const addToLastSearches = (term) => {
    const lastSearches = searchedTerms.filter((keyword) => keyword !== term);
    lastSearches.unshift(term);
    lastSearches.splice(4);
    setSearchedTerms(lastSearches);
  };

  const tooltipProps = {
    message: 'Para mejorar tu experiencia de compra, cuéntanos ¿Dónde te encuentras ?',
    onClick: () => {
      setIsZoneModalOpen(true);
    },
    onClose: () => null,
    buttonLabel: 'Ingresa tu ubicación',
  };

  const searchedTerm = router.query['text.es-CL'] as string;

  const searchboxProps = {
    value: searchedTerm || '',
    onSearch: (term) => {
      if (!term || term === '') return;
      addToLastSearches(term);
      router.push(`/search?offset=0&text.es-CL=${term}`);
    },
    onTypeSearch: (terms) => {
      console.log('< typed', terms);
    },
    lastSearched: searchedTerms,
    flyoutTitle: 'Búsquedas recientes',
    placeholder: 'Nombre, SKU, categoría, etc',
  };

  const handleOnClickUser = async () => {
    setIsLoginModalOpen(true);
  };

  const handleOnClickCart = () => {
    router.push('/cart');
  };

  const handleOnCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleOnCloseZoneModal = () => {
    setIsZoneModalOpen(false);
  };

  const handleLogin = async (values: EmailPassword) => {
    await trigger(values);
    setIsLoginModalOpen(false);
    router.reload();
  };

  const totalItemsInCart = (cart) => {
    return cart?.lineItems?.reduce((accumulated,lineItem) => { return accumulated + lineItem.quantity}, 0)
  }

  return (
    <>
      <LoginModal open={isLoginModalOpen} onClose={handleOnCloseLoginModal} onSubmit={handleLogin} />
      <ZoneSelector open={isZoneModalOpen} onClose={handleOnCloseZoneModal} />
      <Navbar
        linkRenderer={linkRenderer}
        menuProps={{
          title: 'Nuestras categorías',
          menuData: menuData,
          linkRenderer: categoryLinkRenderer,
        }}
        tooltipProps={tooltipProps}
        zoneLabel={user.zoneLabel}
        searchboxProps={searchboxProps}
        onClickUser={handleOnClickUser}
        onClickCart={handleOnClickCart}
        isLoggedIn={user.loggedIn}
        cartQuantity={totalItemsInCart(cart)}
        openTooltipOnMount={user.isFirstTime}
      />
    </>
  );
};

export default Header;
