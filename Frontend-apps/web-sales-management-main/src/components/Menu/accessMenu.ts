import { Role } from '@/types/User';
import { IconName } from '@adelco/web-components/dist/src/utils/types';
export type AccessMenuItem = {
  link: string;
  roles: Role[];
  label: string;
  iconName?: IconName | string;
  submenu?: AccessMenuItem[];
};

export const accessMenu = [
  [
    {
      link: '/users',
      roles: [Role.Admin],
      label: 'Usuarios',
      iconName: 'user_inactive'
    },
    {
      link: '/clients',
      roles: [Role.Supervisor, Role.ZoneManager, Role.GeneralManager],
      label: 'Clientes',
      iconName: 'store_front'
    },
    {
      link: '/territories',
      roles: [Role.Supervisor, Role.ZoneManager, Role.GeneralManager],
      label: 'Territorios',
      iconName: 'person_pin_circle'
    }
  ],
  [
    {
      link: '/roles',
      roles: [],
      label: 'Roles',
      iconName: 'roles'
    },
    {
      link: '/sales-entities',
      roles: [Role.GeneralManager, Role.ZoneManager],
      label: 'Entidades de venta',
      iconName: 'work_outline',
      submenu: [
        {
          link: '/sales-entities/zones',
          roles: [Role.GeneralManager],
          label: 'Zonas'
        },
        {
          link: '/sales-entities/branches',
          roles: [Role.GeneralManager],
          label: 'Sucursales'
        },
        {
          link: '/sales-entities/supervised-area',
          roles: [Role.GeneralManager, Role.ZoneManager],
          label: 'Áreas supervisadas'
        }
      ]
    }
  ],
  [
    {
      link: '/clientMap',
      roles: [Role.Supervisor],
      label: 'Mapa de clientes',
      iconName: 'map'
    }
  ]
];
