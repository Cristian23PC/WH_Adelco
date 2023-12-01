import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import BottomPriceBar from './BottomPriceBar';
import useScreen from '../../../utils/hooks/useScreen/useScreen';

export default {
  title: 'UI Kit/Structure/Bottom Price Bar',
  component: BottomPriceBar,
  decorators: [withDesign]
} as ComponentMeta<typeof BottomPriceBar>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1141-3873&t=eFn5umr6t4PJ9qqu-0'
  }
};

const Template: ComponentStory<typeof BottomPriceBar> = (args) => {
  const { isMobile } = useScreen();
  return (
    <>
      {isMobile && <BottomPriceBar {...args} />}
      {!isMobile && (
        <div className="text-red-700 font-bold m-5">
          This component is only available for mobile resolution
        </div>
      )}
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  totalPrice: '$22.700'
};
Default.storyName = 'Bottom Price Bar';
Default.parameters = { ...designParameters, layout: 'fullscreen' };
