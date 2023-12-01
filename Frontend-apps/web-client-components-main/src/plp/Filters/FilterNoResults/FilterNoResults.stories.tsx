import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import FilterNoResults from './FilterNoResults';

export default {
  title: 'PLP/Filters/FilterNoResults',
  component: FilterNoResults,
  decorators: [withDesign],
  argTypes: {
    literals: {
      table: {
        control: { type: 'object' },
        defaultValue: {
          summary: JSON.stringify({
            title: 'No hay resultados para mostrar.',
            textButton: 'Revisa los filtros aplicados'
          })
        }
      }
    },
    'data-testid': {
      table: { defaultValue: { summary: 'adelco-filter-no-results' } }
    }
  }
} as ComponentMeta<typeof FilterNoResults>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=10561-426676&mode=design&t=XKBqDSR8aTbNMoqg-0'
  }
};

const Template: ComponentStory<typeof FilterNoResults> = (args) => {
  return (
    <div className="max-w-[258px] m-auto">
      <FilterNoResults {...args} />
    </div>
  );
};
export const FilterNoResultsStory = Template.bind({});
FilterNoResultsStory.storyName = 'FilterNoResults';
FilterNoResultsStory.args = {
  onClick: () => {
    alert('on click');
  }
};
FilterNoResultsStory.parameters = { layout: 'fullscreen', ...designParameters };

export const FilterNoResultsWithoutOnClickStory = Template.bind({});
FilterNoResultsWithoutOnClickStory.storyName = 'FilterNoResultsWithoutOnClick';
FilterNoResultsWithoutOnClickStory.argTypes = {
  onClick: { control: false }
};
FilterNoResultsWithoutOnClickStory.args = {
  onClick: undefined
};
FilterNoResultsWithoutOnClickStory.parameters = {
  layout: 'fullscreen',
  ...designParameters
};
