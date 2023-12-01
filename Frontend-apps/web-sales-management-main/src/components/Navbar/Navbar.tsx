import { FC } from 'react';
import Link from 'next/link';
import { Button, Icon, Logo } from '@adelco/web-components';
import { usePathname } from 'next/navigation';
import { mapRoleName } from '@/utils/mappers/users/users';
import { Role } from '@/types/User';
import useAuthentication from '@/hooks/auth/useAuthentication';
import { logout } from '@/api/Keycloak';

export interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { data } = useAuthentication();
  const pathname = usePathname();

  const logoUrl = data?.name ? '/dashboard' : '/';

  return (
    <nav
      className="bg-white border-b-[1px] border-silver"
      data-testid="adelco-navbar"
    >
      <div className="mx-auto px-4 desktop:px-0 flex items-center justify-between py-[14px] w-[1280px] desktop:w-[1340px] h-[76px]">
        <div className="flex gap-6">
          <Link href={logoUrl}>
            <Logo />
          </Link>
          <div className="flex gap-2">
            <Icon name="desktop" />
            <span>Web de gestión</span>
          </div>
        </div>

        {pathname !== '/' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="rounded-3xl border border-corporative-01 p-[7px]">
                <Icon name="user_active" width={16} height={16} />
              </div>
              <div className="grid items-start text-xs">
                <div className="font-semibold">{data?.name}</div>
                <div className="text-moon">
                  {data?.role && mapRoleName(data.role as Role)}
                </div>
              </div>
            </div>
            <Button variant="tertiary" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
