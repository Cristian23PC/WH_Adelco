import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import CartItemCard from './CartItemCard';

export default {
  title: 'UI Kit/Structure/CartItemCard',
  component: CartItemCard,
  decorators: [withDesign]
} as ComponentMeta<typeof CartItemCard>;

const lineItem = {
  id: 'id-01',
  brandName: 'Espíritu Gaucho',
  name: 'Yerba Mate con Palos Sabor Hierbas Serranas',
  unitSize: '350g',
  imageUrl:
    'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-e-_YfJhI.png',
  price: '$8700',
  unitPrice: '$580',
  discount: '-25%',
  quantity: 1,
  sellUnit: 'Caja'
};

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1141-3873&t=BWdVsI6qunc5O2Sx-0'
  }
};

const Template: ComponentStory<typeof CartItemCard> = () => {
  const { isMobile } = useScreen();
  const [item, setItem] = useState(lineItem);
  return (
    <div className="w-[288px] tablet:w-[475px] desktop:w-[545px] m-5">
      <CartItemCard
        lineItem={item}
        isMobile={isMobile}
        onChangeQuantity={(id: string, num: number) => {
          setItem((prevState) => ({
            ...prevState,
            quantity: num
          }));
        }}
        onDelete={() => {
          setItem((prevState) => ({
            ...prevState,
            quantity: 0
          }));
        }}
      />
    </div>
  );
};

export const story = Template.bind({});
story.parameters = { ...designParameters, layout: 'fullscreen' };
story.storyName = 'Cart Item Card';
