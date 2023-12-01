import React from 'react';
import { screen, render } from '@testing-library/react';
import ThankYouScreen from './ThankYouScreen';
import { type LinkRenderer } from '../../../../utils/types';

const mockLinkRenderer: LinkRenderer = (link, label, target) => (
  <a data-testid="link-rendered" href={link} target={target}>
    {label}
  </a>
);

describe('ThankYouScreen component', () => {
  it('renders ThankYouScreen component', () => {
    render(<ThankYouScreen linkRenderer={mockLinkRenderer} />);
    expect(screen.getByTestId('adelco-thank-you-page')).toBeInTheDocument();
  });

  it('renders custom literals texts', () => {
    const customLiterals = {
      title: 'test_title',
      text: 'test_text',
      buttonLabel: 'test_buttonLabel'
    };
    render(
      <ThankYouScreen
        literals={customLiterals}
        linkRenderer={mockLinkRenderer}
      />
    );

    expect(screen.getByText(customLiterals.title)).toBeInTheDocument();
    expect(screen.getByText(customLiterals.text)).toBeInTheDocument();
    expect(screen.getByText(customLiterals.buttonLabel)).toBeInTheDocument();
  });
});
