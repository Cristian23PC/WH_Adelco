import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import DatePicker from './DatePicker';

export default {
  title: 'Ui Kit/Input/DatePicker',
  component: DatePicker,
  decorators: [withDesign]
} as ComponentMeta<typeof DatePicker>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/J1KIL9QYoFafGo20Cu14yY/Management-Website?node-id=3663%3A101764&mode=dev'
  }
};

const Template: ComponentStory<typeof DatePicker> = (args) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="w-[203px] px-4">
      <DatePicker {...args} date={date} onChange={setDate} />
    </div>
  );
};

export const Default = Template.bind({});
Default.storyName = 'DatePicker';
Default.args = {
  allowPastDates: false
};
Default.parameters = designParameters;
