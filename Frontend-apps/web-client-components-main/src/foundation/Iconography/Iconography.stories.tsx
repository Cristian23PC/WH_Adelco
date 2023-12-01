import React from 'react';
import { type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import * as iconNames from '../../uikit/feedback/Icon/iconNames';

import IconComponent from '../../uikit/feedback/Icon/Icon';

export default {
  title: 'Foundation/Iconography',
  component: IconComponent,
  decorators: [withDesign]
} as ComponentMeta<typeof IconComponent>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1138-3114&t=6jP8yqZXk6OO3aRg-4'
  }
};

export const Iconography = (): JSX.Element => {
  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-8 p-5 gap-10">
      {Object.values(iconNames).map((iconName) => (
        <div key={iconName} className="flex gap-2 flex-col items-center">
          <IconComponent name={iconName} />
          <span className="text-xs">{iconName}</span>
        </div>
      ))}
    </div>
  );
};
Iconography.parameters = designParameters;
