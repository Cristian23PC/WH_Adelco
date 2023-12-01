import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '../../actions/Button';
import SortMenu from './SortMenu';
import { mockSortList } from './mocks';

export default {
  title: 'Ui Kit/Navigation/SortMenu',
  component: SortMenu
} as ComponentMeta<typeof SortMenu>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1336-2966&mode=design&t=juPXwJhER25z98WR-4'
  }
};

const Template: ComponentStory<typeof SortMenu> = (args) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  const toggleOpen = (): void => {
    setOpen(!open);
  };

  const onSelectHandler = (value: string | undefined): void => {
    setSelected(value);
  };
  const onClose = (): void => {
    setOpen(false);
  };
  return (
    <>
      <Button size="sm" onClick={toggleOpen} variant="tertiary">
        Sort
      </Button>
      <SortMenu
        {...args}
        open={open}
        onApply={action('Apply')}
        onClose={onClose}
        selectedValue={selected}
        onSelect={onSelectHandler}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  open: false,
  title: 'Ordenar productos',
  sortList: mockSortList
};
Default.parameters = designParameters;
Default.storyName = 'SortMenu';
