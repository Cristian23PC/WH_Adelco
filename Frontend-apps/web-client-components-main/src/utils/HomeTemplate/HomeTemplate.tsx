import React, { type FC, type PropsWithChildren } from 'react';
import Navbar, {
  type Props as NavbarProps
} from '../../uikit/navigation/Navbar/Navbar';
import { searchboxProps, tooltipProps, menuProps } from './data';
import { Footer } from '../../uikit/navigation';
import footerPropsMock from '../../uikit/navigation/Footer/FooterProps.mock';
import { linkRendererMock } from '../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';
import { type UserMenuProps } from '../../uikit/navigation/Navbar/partials/User/UserMenu/UserMenu';

interface Props extends PropsWithChildren {
  navBarProps?: Partial<NavbarProps>;
}

const HomeTemplate: FC<Props> = ({ navBarProps: nBProps = {}, children }) => {
  const navBarProps = {
    linkRenderer: linkRendererMock,
    onRegisterClick: () => {},
    searchboxProps,
    tooltipProps,
    menuProps,
    ...nBProps
  };

  const userMenuProps: UserMenuProps = {
    username: 'John Doe',
    linkRenderer: linkRendererMock,
    onClickMyAccount: () => {},
    onClose: () => {},
    onLogout: () => {},
    open: false
  };

  return (
    <>
      <Navbar {...navBarProps} userMenuProps={userMenuProps} />
      <div className="min-h-[calc(100vh-300px)]">{children}</div>
      <Footer {...footerPropsMock} />
    </>
  );
};

export default HomeTemplate;
