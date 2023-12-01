import React from 'react';
import { render, screen } from '@testing-library/react';
import Link, { type LinkProps } from './Link';
import { type LinkRenderer } from '../../../utils/types';

describe('Link', () => {
  const defaultTestId = 'adelco-link';

  const mockLinkRenderer: LinkRenderer = (link, label, target) => (
    <a data-testid="link-rendered" href={link} target={target}>
      {label}
    </a>
  );
  const linkProps: LinkProps = {
    url: '#',
    linkRenderer: mockLinkRenderer
  };
  it('Should render component', () => {
    render(<Link {...linkProps}>click here</Link>);

    expect(screen.queryByText(/click here/)).toBeInTheDocument();
  });

  it('Should render primary styles', () => {
    render(
      <Link {...linkProps} variant="primary">
        link text
      </Link>
    );

    const link = screen.getByTestId(defaultTestId);
    const classList = link.getAttribute('class');

    expect(classList).toContain('text-corporative-03');
    expect(classList).toContain('ring-inset');
    expect(classList).toContain('ring-silver');
    expect(classList).toContain('focus:ring');
    expect(classList).toContain('focus:ring-corporative-02');
    expect(classList).toContain('disabled:text-corporative-02');
    expect(classList).toContain('disabled:opacity-30');
  });

  it('Should render secondary styles', () => {
    render(
      <Link {...linkProps} variant="secondary">
        link text
      </Link>
    );

    const link = screen.getByTestId(defaultTestId);
    const classList = link.getAttribute('class');

    expect(classList).toContain('text-white');
    expect(classList).toContain('bg-corporative-03');
    expect(classList).toContain('hover:bg-corporative-02-hover');
    expect(classList).toContain('active:bg-corporative-02');
    expect(classList).toContain('focus:ring');
    expect(classList).toContain('focus:ring-inset');
    expect(classList).toContain('focus:ring-corporative-02-hover');
    expect(classList).toContain('disabled:bg-corporative-02');
    expect(classList).toContain('disabled:opacity-30');
  });
});
