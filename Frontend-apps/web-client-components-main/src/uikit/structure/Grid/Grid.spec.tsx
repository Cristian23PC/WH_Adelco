import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Grid, { type GridProps } from './Grid';

describe('Product Grid', () => {
  it('should render the component with default props', () => {
    render(
      <Grid>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div className={`example-${index}`} key={index}>
              <span>{index}</span>
            </div>
          ))}
      </Grid>
    );
    const gridElement = screen.getByTestId('adelco-product-grid');
    expect(gridElement).toBeInTheDocument();
    expect(gridElement.children).toHaveLength(10);
  });
  it('should render the grid the correct classes on tablet breakpoint', async () => {
    render(
      <Grid>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div className={`example-${index}`} key={index}>
              <span>{index}</span>
            </div>
          ))}
      </Grid>
    );
    const gridElement = screen.getByTestId('adelco-product-grid');
    expect(gridElement).toHaveClass('grid-cols-2', 'gap-4');

    // tablet breakpoint
    global.innerWidth = 800;
    global.dispatchEvent(new Event('resize'));
    await waitFor(() => {
      expect(gridElement).toHaveClass('tablet:grid-cols-4', 'tablet:gap-4');

      setTimeout(() => {
        const gridStyles = window.getComputedStyle(gridElement);
        expect(gridStyles.gridTemplateColumns).toBe(
          'repeat(4, minmax(0, 1fr))'
        );
        expect(gridStyles.gap).toBe('1rem');
      }, 100);
    });
  });
  it('should render the grid the correct classes on desktop breakpoint', async () => {
    render(
      <Grid>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div className={`example-${index}`} key={index}>
              <span>{index}</span>
            </div>
          ))}
      </Grid>
    );
    const gridElement = screen.getByTestId('adelco-product-grid');
    expect(gridElement).toHaveClass('grid-cols-2', 'gap-4');

    // desktop breakpoint
    global.innerWidth = 1340;
    global.dispatchEvent(new Event('resize'));
    await waitFor(() => {
      expect(gridElement).toHaveClass('desktop:grid-cols-5', 'desktop:gap-2');

      // add a short delay to ensure styles have been applied
      setTimeout(() => {
        const gridStyles = window.getComputedStyle(gridElement);
        expect(gridStyles.gridTemplateColumns).toBe(
          'repeat(5, minmax(0, 1fr))'
        );
        expect(gridStyles.gap).toBe('gap: 0.5rem');
      }, 100);
    });
  });
  it('should render the component with overwritten props', () => {
    const props: GridProps = {
      mobileCols: 1,
      tabletCols: 3,
      desktopCols: 4,
      mobileGap: 5,
      tabletGap: 5,
      desktopGap: 1,
      desktopMaxWidthLimited: false
    };
    render(
      <Grid {...props}>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div className={`example-${index}`} key={index}>
              <span>{index}</span>
            </div>
          ))}
      </Grid>
    );
    const gridElement = screen.getByTestId('adelco-product-grid');
    expect(gridElement).toBeInTheDocument();
    expect(gridElement).toHaveClass(
      'grid',
      'items-stretch',
      'grid-cols-1',
      'gap-5',
      'tablet:grid-cols-3',
      'tablet:gap-5',
      'desktop:grid-cols-4',
      'desktop:gap-1'
    );
  });
});
