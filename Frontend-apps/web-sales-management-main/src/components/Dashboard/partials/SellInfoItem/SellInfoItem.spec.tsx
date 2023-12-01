import { act, render, screen } from '@testing-library/react';
import SellInfoItem, { SellInfoItemProps } from './SellInfoItem';

const Component = (props: Partial<SellInfoItemProps>) => (
  <SellInfoItem
    count="foo-count"
    label="foo-label"
    isLoading={false}
    {...props}
  />
);

describe('SellInfoItem component', () => {
  describe('render', () => {
    it('should render count correctly', () => {
      const count = 'bar-count';
      render(<Component count={count} />);

      expect(screen.getByText(count)).toBeInTheDocument();
    });

    it('should render label correctly', () => {
      const label = 'bar-label';
      render(<Component label={label} />);

      expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('should render default count if there is not set', () => {
      render(<Component count={undefined} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should not render count if there is loading', async () => {
      const count = 'not-displayed';

      await act(async () => {
        render(<Component count={count} isLoading />);
      });

      expect(screen.queryByText(count)).not.toBeInTheDocument();
    });
  });
});
