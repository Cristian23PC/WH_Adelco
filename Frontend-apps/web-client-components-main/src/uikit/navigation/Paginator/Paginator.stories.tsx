import React, { type FC, useState, useEffect } from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import PaginatorComponent, { type PaginatorProps } from './Paginator';

export default {
  title: 'UI Kit/Navigation/Paginator',
  component: PaginatorComponent,
  decorators: [withDesign],
  excludeStories: /DefaultLogo/
} as ComponentMeta<typeof PaginatorComponent>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1206-6124&t=xuW11UJrPUt2cxlT-4'
  }
};

const Paginator: FC<PaginatorProps> = (args) => {
  const totalPages = args.totalPages ?? 10;
  const [currentPage, setCurrentPage] = useState<number>(args.currentPage ?? 1);

  const changePage = (page: number): void => {
    setCurrentPage(page);
  };

  useEffect(() => {
    changePage(args.currentPage);
  }, [args.currentPage]);

  return (
    <PaginatorComponent
      totalPages={totalPages}
      currentPage={currentPage}
      onClick={changePage}
    />
  );
};

const Template: ComponentStory<typeof Paginator> = (args) => (
  <Paginator {...args} />
);

export const Default = Template.bind({});
Default.storyName = 'Paginator';
Default.parameters = designParameters;
Default.args = {
  totalPages: 10,
  currentPage: 1
};
