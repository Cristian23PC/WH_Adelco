import React, { type FC } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryCarousel, {
  type CategoryCarouselProps
} from './CategoryCarousel';
import examples from './examples';
import { type LinkRenderer } from '../../../utils/types';

const mockLinkRenderer: LinkRenderer = (link, label, target) => (
  <a data-testid="link-rendered" href={link} target={target}>
    {label}
  </a>
);

const products = examples.map((example) => {
  return {
    ...example,
    productUrl: `/producto/${example.slug}`,
    linkRenderer: mockLinkRenderer
  };
});

const Component: FC<Partial<CategoryCarouselProps>> = (overwriteProps) => {
  return (
    <CategoryCarousel
      products={products}
      title="Category"
      {...overwriteProps}
    />
  );
};

describe('Category Carrousel', () => {
  it('should render the carrousel the correct classes on tablet breakpoint', async () => {
    render(<Component />);
    const carrouselElement = screen.getByTestId('adelco-carrousel');
    expect(carrouselElement).toBeInTheDocument();
  });
});
