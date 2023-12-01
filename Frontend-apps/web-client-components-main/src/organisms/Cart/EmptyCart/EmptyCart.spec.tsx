import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import EmptyCart from './EmptyCart';
import { type LinkRenderer } from '../../../utils/types';

const mockLinkRenderer: LinkRenderer = (link, label, target) => (
  <a data-testid="link-rendered" href={link} target={target}>
    {label}
  </a>
);

describe('EmptyCart component', () => {
  it('renders label text', () => {
    render(<EmptyCart linkRenderer={mockLinkRenderer} />);
    expect(screen.getByTestId('adelco-empty-cart')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const customLiterals = {
      title: 'test_title',
      mobileText: 'test_mobileText',
      text: 'test_text',
      buttonLabel: 'test_buttonLabel'
    };
    const { getByText } = render(
      <EmptyCart literals={customLiterals} linkRenderer={mockLinkRenderer} />
    );

    expect(getByText(customLiterals.title)).toBeInTheDocument();
    expect(getByText(customLiterals.text)).toBeInTheDocument();
    expect(getByText(customLiterals.buttonLabel)).toBeInTheDocument();

    global.innerWidth = 320;
    global.dispatchEvent(new Event('resize'));

    await waitFor(async () => {
      expect(() => screen.getByText(customLiterals.text)).toThrow();
      expect(getByText(customLiterals.mobileText)).toBeInTheDocument();
    });
  });
});
