import { render, screen } from '@testing-library/react';
import DashboardSection, { DashboardSectionProps } from './DashboardSection';

const Component = (props: Partial<DashboardSectionProps>) => (
  <DashboardSection title="foo-title" {...props}>
    {props.children ?? 'foo-children'}
  </DashboardSection>
);

describe('DashboardSection component', () => {
  describe('render', () => {
    it('should render title correctly', () => {
      const title = 'bar-title';
      render(<Component title={title} />);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      const children = 'bar-children';
      render(<Component>{children}</Component>);

      expect(screen.getByText(children)).toBeInTheDocument();
    });
  });
});
