import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CategoryItem from './components/CategoryItem';
import SubcategoriesMenu from './components/SubcategoriesMenu';
import CategoriesMenuHeader from './components/CategoriesMenuHeader';
import CategoriesMenuBody from './components/CategoriesMenuBody';
import { type LinkRenderer } from '../../../utils/types';

const mockMenuData = [
  { title: 'Menu 1', slug: 'menu1' },
  { title: 'Menu 2', slug: 'menu2' },
  { title: 'Menu 3', slug: 'menu3' }
];

const mockLinkRenderer: LinkRenderer = (link, label, target) => (
  <a data-testid="link-rendered" href={link} target={target}>
    {label}
  </a>
);

describe('CategoriesMenu', () => {
  describe('CategoriesMenuHeader', () => {
    it('Should render', async () => {
      render(<CategoriesMenuHeader title="title" onClose={() => {}} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(await screen.findByTestId('icon-close')).toBeInTheDocument();
      expect(screen.getByTestId('adelco-menu-header')).toBeInTheDocument();
      expect(screen.getByText('title')).toBeInTheDocument();
    });

    it('Should not render back button when onBack is not passed', () => {
      render(<CategoriesMenuHeader title="title" onClose={() => {}} />);

      expect(screen.queryByTestId('icon-arrow_s_left')).not.toBeInTheDocument();
    });

    it('Should render back button when onBack is passed', async () => {
      render(
        <CategoriesMenuHeader
          title="title"
          onClose={() => {}}
          onBack={() => {}}
        />
      );

      expect(await screen.findByTestId('icon-arrow_back')).toBeInTheDocument();
    });

    it('Should call onClose when close button is clicked', async () => {
      const onClose = jest.fn();
      render(<CategoriesMenuHeader title="title" onClose={onClose} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClose).toHaveBeenCalled();
    });

    it('Should call onBack when back button is clicked', async () => {
      const onBack = jest.fn();
      render(
        <CategoriesMenuHeader
          title="title"
          onClose={() => {}}
          onBack={onBack}
        />
      );

      fireEvent.click(await screen.findByTestId('icon-arrow_back'));

      expect(onBack).toHaveBeenCalled();
    });
  });

  describe('CategoriesMenuBody', () => {
    it('Should render', () => {
      render(
        <CategoriesMenuBody
          linkRenderer={mockLinkRenderer}
          placement="left"
          menuData={mockMenuData}
          onClose={() => {}}
          show
        />
      );

      expect(screen.getByTestId('adelco-menu-body')).toBeInTheDocument();
      expect(screen.getByText('Menu 1')).toBeInTheDocument();
      expect(screen.getByText('Menu 2')).toBeInTheDocument();
      expect(screen.getByText('Menu 3')).toBeInTheDocument();
    });

    it('Should click on item with children', async () => {
      const clickItem = jest.fn();
      const data = [
        {
          title: 'first',
          onClick: clickItem,
          children: [{ title: 'first.1' }]
        },
        ...mockMenuData
      ];
      render(
        <CategoriesMenuBody
          linkRenderer={mockLinkRenderer}
          placement="left"
          menuData={data}
          onClose={() => {}}
          show
        />
      );

      expect(screen.queryByTestId('adelco-offcanvas')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText('first'));

      expect(screen.getByTestId('adelco-offcanvas')).toBeInTheDocument();

      expect(await screen.findByText('first.1')).toBeInTheDocument();
    });

    it('Should click on item without children', () => {
      const onClose = jest.fn();
      render(
        <CategoriesMenuBody
          linkRenderer={mockLinkRenderer}
          placement="left"
          menuData={mockMenuData}
          onClose={onClose}
          show
        />
      );

      expect(screen.queryByTestId('adelco-offcanvas')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText('Menu 1'));

      expect(onClose).toHaveBeenCalled();
      expect(screen.queryByTestId('adelco-offcanvas')).not.toBeInTheDocument();
    });

    it('Should works when onClick is not passed', () => {
      const data = [
        {
          title: 'first'
        },
        ...mockMenuData
      ];
      render(
        <CategoriesMenuBody
          linkRenderer={mockLinkRenderer}
          placement="left"
          menuData={data}
          onClose={() => {}}
          show
        />
      );

      fireEvent.click(screen.getByText('first'));
    });
  });

  describe('SubcategoriesMenu', () => {
    it('Should render', () => {
      render(
        <SubcategoriesMenu
          linkRenderer={mockLinkRenderer}
          menuData={mockMenuData}
          placement="left"
          selectedOption={0}
          onClose={() => {}}
          onBack={() => {}}
        />
      );

      expect(screen.getByText('Menu 1')).toBeInTheDocument();
      expect(screen.getByTestId('adelco-menu-header')).toBeInTheDocument();
      expect(screen.getByTestId('adelco-menu-body')).toBeInTheDocument();
    });

    it('Should not render when selectedOption not exists', () => {
      render(
        <SubcategoriesMenu
          linkRenderer={mockLinkRenderer}
          menuData={mockMenuData}
          placement="left"
          selectedOption={5}
          onClose={() => {}}
          onBack={() => {}}
        />
      );

      expect(
        screen.queryByTestId('adelco-menu-header')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('adelco-menu-body')).not.toBeInTheDocument();
    });
  });

  describe('CategoryItem', () => {
    it('Should render', () => {
      render(
        <CategoryItem linkRenderer={mockLinkRenderer} item={mockMenuData[0]} />
      );

      const item = screen.getByTestId('category-item-Menu 1');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Menu 1');
      expect(item).toHaveClass(
        'flex justify-between items-center py-2 px-4 gap-2 text-sm hover:bg-snow'
      );
    });

    it('Should render icon when has children', async () => {
      render(
        <CategoryItem
          linkRenderer={mockLinkRenderer}
          item={{ ...mockMenuData[0], children: [{ title: 'test' }] }}
        />
      );

      expect(
        await screen.findByTestId('icon-arrow_s_right')
      ).toBeInTheDocument();
    });

    it('Should not render icon when not has children', () => {
      render(
        <CategoryItem linkRenderer={mockLinkRenderer} item={mockMenuData[0]} />
      );

      expect(
        screen.queryByTestId('icon-arrow_s_right')
      ).not.toBeInTheDocument();
    });

    it('Should call onClick when clicked', () => {
      const onClick = jest.fn();
      render(
        <CategoryItem
          linkRenderer={mockLinkRenderer}
          item={mockMenuData[0]}
          onClick={onClick}
        />
      );

      const item = screen.getByTestId('category-item-Menu 1');

      fireEvent.click(item);
      expect(onClick).toHaveBeenCalled();
    });

    it('Should render with wrapper', () => {
      const linkRendererFn = jest.fn(mockLinkRenderer);
      render(
        <CategoryItem linkRenderer={linkRendererFn} item={mockMenuData[0]} />
      );

      expect(linkRendererFn).toHaveBeenCalled();
      expect(screen.getByTestId('link-rendered')).toBeInTheDocument();
    });

    it('Should not render wrapper when has children', () => {
      const linkRendererFn = jest.fn(mockLinkRenderer);
      render(
        <CategoryItem
          linkRenderer={linkRendererFn}
          item={{ ...mockMenuData[0], children: [{ title: 'test' }] }}
        />
      );

      expect(linkRendererFn).not.toHaveBeenCalled();
      expect(screen.queryByTestId('link-rendered')).not.toBeInTheDocument();
      expect(screen.getByText('Menu 1')).toBeInTheDocument();
    });
  });
});
