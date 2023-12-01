import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import { type MenuItem } from './partials/User/UserMenu/types';

import Navbar from './Navbar';
import {
  linkRendererMock,
  menuDataMock
} from '../CategoriesMenu/CategoriesMenuMocks';
import { DeliveryAddressModal } from '../../../organisms';
import { action } from '@storybook/addon-actions';

export default {
  title: 'UI Kit/Navigation/Navbar',
  component: Navbar,
  decorators: [withDesign]
} as ComponentMeta<typeof Navbar>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=889-1944&t=xuW11UJrPUt2cxlT-4'
  }
};

const mockAddressList = [
  {
    id: '1',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '2',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '3',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '4',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  }
];

const additionalOptions: MenuItem[] = [
  {
    label: 'Option 1',
    value: 'opt-1',
    onClick: () => {
      console.log('opt-1');
    }
  },
  {
    label: 'Option 2',
    value: 'opt-2',
    onClick: () => {
      console.log('opt-2');
    }
  }
];

const Template: ComponentStory<typeof Navbar> = (args) => {
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>('');
  const [open, setOpen] = React.useState<boolean>(false);
  const handleSelectAddress = (id: string): void => {
    action('Select address')(id);
    setSelectedAddressId(id);
  };

  return (
    <>
      <DeliveryAddressModal
        addressList={mockAddressList}
        onAddAddress={action('Add address')}
        onSelectAddress={handleSelectAddress}
        selectedAddressId={selectedAddressId}
        onAddressChange={action('Address change')}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      />
      <Navbar
        {...args}
        onClickAddress={() => {
          console.log('Click address');
          setOpen(true);
        }}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Navbar';
Default.parameters = { layout: 'fullscreen', ...designParameters };
Default.args = {
  linkRenderer: linkRendererMock,
  searchboxProps: {
    lastSearched: ['Durex', 'Mate', 'Agua Mineral'],
    suggestionList: [],
    onSearch: () => {},
    onTypeSearch: () => {},
    placeholder: 'Busca en Adelco.cl',
    flyoutTitle: 'Búsquedas recientes'
  },
  menuProps: {
    menuData: menuDataMock,
    title: 'Categorías',
    linkRenderer: linkRendererMock,
    promotionalBanners: [
      {
        imageURL:
          'https://images.pexels.com/photos/5872364/pexels-photo-5872364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        link: '/'
      },
      {
        imageURL:
          'https://images.pexels.com/photos/5872348/pexels-photo-5872348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        link: '/'
      }
    ]
  },
  userMenuProps: {
    open: true,
    username: 'Esteban Esteban',
    linkRenderer: linkRendererMock,
    onClose: () => {},
    onClickMyAccount: () => {
      console.log('Going to My Account..');
    },
    onLogout: () => {
      console.log('Logging Out..');
    },
    additionalOptions
  }
};
