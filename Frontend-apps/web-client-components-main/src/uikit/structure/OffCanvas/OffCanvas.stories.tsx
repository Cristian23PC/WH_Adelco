import React, { useEffect, useState } from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import OffCanvas from './OffCanvas';
import { Button } from '../../actions/Button';

export default {
  title: 'Ui Kit/Structure/OffCanvas',
  component: OffCanvas
} as ComponentMeta<typeof OffCanvas>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=1621-371017&t=Fj5EfDeojGUdcclf-4'
  }
};

const menuData = [
  { title: 'Menu 1', children: [{ title: 'Menu 1.1' }, { title: 'Menu 1.2' }] },
  { title: 'Menu 2', children: [{ title: 'Menu 2.1' }, { title: 'Menu 2.2' }] },
  { title: 'Menu 3', children: [{ title: 'Menu 3.1' }, { title: 'Menu 3.2' }] },
  { title: 'Menu 4', children: [{ title: 'Menu 4.1' }, { title: 'Menu 4.2' }] },
  { title: 'Menu 5', children: [{ title: 'Menu 5.1' }, { title: 'Menu 5.2' }] },
  { title: 'Menu 6', children: [{ title: 'Menu 6.1' }, { title: 'Menu 6.2' }] }
];

const Template: ComponentStory<typeof OffCanvas> = (args) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(args.show);
  }, [args.show]);

  const OffCanvasContent = (): any => {
    const [selectedOption, setSelectedOption] = useState(-1);

    return (
      <>
        {menuData.map((menu, index) => (
          <>
            <div
              key={menu.title}
              className="cursor-pointer h-10 flex items-center pl-4"
              onClick={() => {
                if (selectedOption === index) {
                  setSelectedOption(-1);
                } else {
                  setSelectedOption(index);
                }
              }}
            >
              {menu.title}
            </div>
          </>
        ))}
        <OffCanvas
          {...args}
          show={menuData[selectedOption] !== undefined}
          isChild
        >
          {menuData[selectedOption]?.children.map((child) => (
            <div
              className="cursor-pointer h-10 flex items-center pl-4"
              key={child.title}
            >
              {child.title}
            </div>
          ))}
        </OffCanvas>
      </>
    );
  };

  return (
    <>
      <Button
        onClick={() => {
          setShow(true);
        }}
      >
        Open
      </Button>
      <OffCanvas
        {...args}
        onClose={() => {
          setShow(false);
        }}
        show={show}
      >
        <OffCanvasContent />
      </OffCanvas>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  show: false,
  placement: 'left'
};
Default.parameters = designParameters;
Default.storyName = 'OffCanvas';
