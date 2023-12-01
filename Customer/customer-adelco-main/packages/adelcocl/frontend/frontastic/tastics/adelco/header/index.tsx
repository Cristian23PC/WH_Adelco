import React, { useMemo, useState, useEffect, ReactNode, useRef } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { Navbar, WelcomeModal } from '@adelco/web-components';
// eslint-disable-next-line import/no-unresolved
import useCart from 'frontastic/actions/adelco/cart/useCart';
import useLogout from 'frontastic/actions/adelco/user/useLogout/useLogout';
import useUser from 'frontastic/actions/adelco/user/useUser/useUser';
import useLocalStorage from '../../../../helpers/hooks/useLocalStorage';
import { categoryMapper } from '../../../../helpers/mappers/categoryMapper';
import { useModalContext } from '../../../../contexts/modalContext';
import AddressSelector from '../addressSelector';
import { toast } from '@adelco/web-components';
import useTrackOpenChangeAddress from 'helpers/hooks/analytics/useTrackOpenChangeAddress';

const MODAL_COOLDOWN_TIME = 2 * 60 * 60; //2 hours

const linkRenderer = (link: string, label: ReactNode) => (
  <Link href={link}>
    <a>{label}</a>
  </Link>
);
const ActiveLink = ({ href, children }) => {
  const { asPath } = useRouter();
  const activeClassName = asPath === href ? 'bg-corporative-01-hover' : '';
  return linkRenderer(href, <div className={activeClassName}>{children}</div>);
};

export const categoryLinkRenderer = (link, label) => (
  <ActiveLink href={link}>{label}</ActiveLink>
);

const Header = ({ data }) => {
  const router = useRouter();
  const { trackOpenChangeAddress } = useTrackOpenChangeAddress();
  const { user, isLoading } = useUser(data?.user?.dataSource);
  const { openLoginModal, openZoneModal } = useModalContext();
  const { trigger: logout } = useLogout();
  const { cart } = useCart();

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isDeliveryAddressModalOpen, setDeliveryAddressModalOpen] =
    useState(false);

  const [searchedTerms, setSearchedTerms] = useLocalStorage(
    'lastSearchedTerms',
    []
  );

  const [isFirstTime, setIsFirstTime] = useLocalStorage(
    'isFirstTime',
    typeof localStorage !== 'undefined' && !localStorage.getItem('isFirstTime') // INFO: Get value directly from localStorage due to delay in useLocalStorage
  );

  useEffect(() => {
    const data = new URL(window.location.href);
    const { openLogin, expiredRefresh, locale, path, ...query } = router.query;

    if (expiredRefresh && !user.loggedIn) {
      toast.error({
        text: 'Session caducada, por favor ingresa tus credenciales.',
        position: 'top-right'
      });
    }
    if (openLogin && !user.loggedIn) {
      openLoginModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.openLogin, router.query.expiredRefresh]);

  useEffect(() => {
    const lastModalOpenTime = Cookie.get('lastModalOpenTime');
    const currentTime = Math.floor(Date.now() / 1000);

    const isCooldownOver =
      !lastModalOpenTime ||
      currentTime - parseInt(lastModalOpenTime, 10) > MODAL_COOLDOWN_TIME;

    if (isCooldownOver && (!user || !(user.zoneLabel || user.loggedIn))) {
      setIsWelcomeModalOpen(true);
      Cookie.set('lastModalOpenTime', String(currentTime), { expires: 1 });
    }
  }, [user, isLoading]);

  const menuData = useMemo(
    () => categoryMapper(data.data.dataSource.categories),
    [data.data.dataSource.categories]
  );

  const promotionalBanners = [];
  if (data.banner1 && data.ctaLink1) {
    promotionalBanners.push({
      imageURL: data.banner1.media.file,
      link: data.ctaLink1
    });
  }
  if (data.banner2 && data.ctaLink2) {
    promotionalBanners.push({
      imageURL: data.banner2.media.file,
      link: data.ctaLink2
    });
  }

  const addToLastSearches = (term) => {
    const lastSearches = searchedTerms.filter((keyword) => keyword !== term);
    lastSearches.unshift(term);
    lastSearches.splice(4);
    setSearchedTerms(lastSearches);
  };

  const tooltipProps = {
    message:
      'Cuéntanos en qué zona te encuentras para consultar precios de nuestros productos.',
    onClick: () => {
      openZoneModal();
    },
    onClose: () => null,
    buttonLabel: 'Ingresa tu ubicación'
  };

  const searchedTerm = router.query['text.es-CL'] as string;

  const searchboxProps = {
    value: searchedTerm || '',
    onSearch: (term) => {
      addToLastSearches(term);
      router.push(`/search?offset=0&text.es-CL=${term}`);
    },
    onClose: () => {
      router.push('/search?offset=0');
    },
    onTypeSearch: (terms) => {
      //console.log('< typed', terms);
    },
    lastSearched: searchedTerms,
    flyoutTitle: 'Búsquedas recientes',
    placeholder: 'Busca en Adelco.cl'
  };

  const handleLogout = (): void => {
    logout();
    router.push('/');
  };

  const userMenuProps = {
    open: false,
    username: user.username,
    linkRenderer,
    onClose: () => null,
    onClickMyAccount: () => null,
    onLogout: () => handleLogout()
  };

  const handleOnClickUser = async () => {
    if (!process.env.NEXT_PUBLIC_DISABLE_FEATURES?.includes('login'))
      openLoginModal();
  };

  const handleOnClickCart = () => {
    router.push('/cart');
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const totalItemsInCart = (cart) => {
    return cart?.lineItems?.reduce((accumulated, lineItem) => {
      return accumulated + lineItem.quantity;
    }, 0);
  };

  const handleOpenAddressSelector = () => {
    const addressInfo = {
      deliveryZone: user?.zoneLabel,
      businessUnitId: user?.businessUnitId,
      t2z: user?.t2z,
      dch: user?.dch
    };

    trackOpenChangeAddress(addressInfo);
    setDeliveryAddressModalOpen(true);
  };

  return (
    <>
      <WelcomeModal
        open={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        registerLink="/register"
        linkRenderer={linkRenderer}
        onClickLogin={() => {
          setIsWelcomeModalOpen(false);
          openLoginModal();
        }}
      />
      <AddressSelector
        open={isDeliveryAddressModalOpen}
        onClose={() => setDeliveryAddressModalOpen(false)}
      />
      <Navbar
        linkRenderer={linkRenderer}
        menuProps={{
          title: 'Nuestras categorías',
          menuData: menuData || [],
          promotionalBanners,
          linkRenderer: categoryLinkRenderer
        }}
        zoneLabel={user.zoneLabel}
        searchboxProps={searchboxProps}
        onClickUser={handleOnClickUser}
        onClickCart={handleOnClickCart}
        isLoggedIn={user.loggedIn}
        cartQuantity={totalItemsInCart(cart)}
        openTooltipOnMount={false}
        userMenuProps={userMenuProps}
        onClickAddress={handleOpenAddressSelector}
        onRegisterClick={handleRegisterClick}
      />
    </>
  );
};

export default Header;
