import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { ToastComponent, toast, Toaster } from './Toast';
import { Button } from '../../actions';

export default {
  title: 'UI Kit/Feedback/Toast',
  component: ToastComponent,
  decorators: [withDesign],
  parameters: {
    docs: {
      source: {
        code: `
        toast.success({
          title: 'Title',
          text: 'Text',
          iconName: 'wifi_offline'
        });
        toast.warning({
          title: 'Title',
          text: 'Text',
          iconName: 'wifi_offline'
        });

        toast.error({
          title: 'Title',
          text: 'Text',
          iconName: 'wifi_offline'
        });
        <>
        <Toaster />
        </>`,
        title: 'Examples'
      }
    }
  }
} as ComponentMeta<typeof ToastComponent>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1141-3845&t=7AFoM0nGgsqMBJjD-0'
  }
};

const Template: ComponentStory<typeof ToastComponent> = (args) => {
  return (
    <>
      <Button
        onClick={() => {
          if (args.type === 'success') {
            toast.success({ ...args });
          } else if (args.type === 'warning') {
            toast.warning({ ...args });
          } else if (args.type === 'failure') {
            toast.error({ ...args });
          }
        }}
      >
        Click to Toast
      </Button>

      <Toaster />
    </>
  );
};

export const Toast = Template.bind({});
Toast.args = {
  title: 'Title',
  text: 'text',
  type: 'success'
};
Toast.parameters = designParameters;
