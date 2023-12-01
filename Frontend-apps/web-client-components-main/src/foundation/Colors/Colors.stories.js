import React from 'react';
import { withDesign } from 'storybook-addon-designs';
import { ColorTag } from './ColorTag';

export default {
  title: 'Foundation/Colors',
  parameters: {
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true
      }
    }
  },
  decorators: [withDesign]
};

export const Colors = () => (
  <>
    <h1 className="font-title font-bold text-2xl">Colors</h1>
    <h3 className="font-bold text-xl mt-10">Primary Palette</h3>

    <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-8 p-5 gap-6">
      <ColorTag color="#FCE300" name="Corporative 01" />
      <ColorTag color="#1D1D1B" name="Corporative 02" />
      <ColorTag color="#424242" name="Corporative 03" />
      <ColorTag color="#FF8A00" name="Corporative 04" />
      <ColorTag color="#FCF297" name="Corporative Hover 01" />
      <ColorTag color="#999999" name="Corporative Hover 02" />
    </div>

    <h3 className="font-bold text-xl mt-10">Secondary Palette</h3>
    <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-8 p-5 gap-6">
      <ColorTag color="#000000" name="Black" />
      <ColorTag color="#666666" name="Nickel" />
      <ColorTag color="#999999" name="Moon" />

      <ColorTag color="#CCCCCC" name="Silver" />
      <ColorTag color="#F3F4F9" name="Snow" />
      <ColorTag color="#FFFFFF" name="White" />
      <ColorTag color="#FAFAFA" name="Page" />
    </div>

    <h3 className="font-bold text-xl mt-10">Semanthic</h3>
    <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-8 p-5 gap-6">
      <ColorTag color="#E74C3C" name="Failure" />
      <ColorTag color="#2ECC71" name="Success" />
      <ColorTag color="#F1C40F" name="Warning" />
      <ColorTag color="#2287FE" name="System" />

      <ColorTag color="#D11E00" name="Failure Dark" />
      <ColorTag color="#03A648" name="Success Dark" />
      <ColorTag color="#C09A01" name="Warning Dark" />
      <ColorTag color="#004E9A" name="System Dark" />

      <ColorTag color="#FADBD8" name="Failure Light" />
      <ColorTag color="#D5F5E3 " name="Success Light" />
      <ColorTag color="#FCF3CF" name="Warning Light" />
      <ColorTag color="#D3E7FF" name="System Light" />
    </div>
  </>
);

Colors.parameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=78-206&viewport=3616%2C3616%2C0.03&t=6jP8yqZXk6OO3aRg-0'
  }
};
