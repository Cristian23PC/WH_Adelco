import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuItem, MenuItemOption } from '@adelco/web-components';
import useAuthentication from '@/hooks/auth/useAuthentication';
import { Role } from '@/types/User';
import { accessMenu, type AccessMenuItem } from './accessMenu';
import { IconName } from '@adelco/web-components/dist/src/utils/types';

const Menu = () => {
  const pathname = usePathname();
  const { data } = useAuthentication();
  const userRole = data?.role as Role;
  const groups = accessMenu
    .map((group) => {
      return group.filter((item) => item.roles.includes(userRole));
    })
    .filter((group) => group.length);

  return (
    <div className="grid gap-6">
      {groups.map((group, index) => {
        return (
          <div key={index} className="grid gap-4 rounded-[24px] bg-white p-4">
            {group.map((item: AccessMenuItem, itemIndex) => {
              if (!item?.submenu) {
                return (
                  <Link href={item.link} key={itemIndex}>
                    <MenuItem
                      active={pathname === item.link}
                      iconName={item.iconName as IconName}
                      label={item.label}
                    />
                  </Link>
                );
              } else {
                const options = item.submenu.map((subItem) => subItem.link);
                return (
                  <div key={itemIndex}>
                    <MenuItem
                      active={options.some((option) => pathname === option)}
                      iconName={item.iconName as IconName}
                      label={item.label}
                    >
                      {item.submenu
                        .filter((subitem) => subitem.roles.includes(userRole))
                        .map((subItem, subItemIndex) => (
                          <Link href={subItem.link} key={subItemIndex}>
                            <MenuItemOption
                              active={pathname === subItem.link}
                              label={subItem.label}
                            />
                          </Link>
                        ))}
                    </MenuItem>
                  </div>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
