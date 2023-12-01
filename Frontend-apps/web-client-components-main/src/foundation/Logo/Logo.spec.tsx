import React from 'react';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
  it('Should render black logo', async () => {
    render(<Logo variant="black" />);
    const logo = await screen.findByTestId('black-logo');
    expect(logo).toBeInTheDocument();
  });

  it('Should render white logo', async () => {
    render(<Logo variant="white" />);
    const logo = await screen.findByTestId('white-logo');
    expect(logo).toBeInTheDocument();
  });

  it('Should render corporative logo', async () => {
    render(<Logo variant="corporative" />);
    const logo = await screen.findByTestId('corporative-logo');
    expect(logo).toBeInTheDocument();
  });
  it('Should render white isotype', async () => {
    render(<Logo variant="white-isotype" />);
    const logo = await screen.findByTestId('white-isotype');
    expect(logo).toBeInTheDocument();
  });

  it('Should render properly default dimensions', async () => {
    render(<Logo />);
    const logo = await screen.findByTestId('corporative-logo');

    expect(logo.getAttribute('height')).toBe('19');
    expect(logo.getAttribute('width')).toBe('80');
  });

  it('Should render height properly with custom width', async () => {
    render(<Logo width={300} />);
    const logo = await screen.findByTestId('corporative-logo');

    expect(logo.getAttribute('height')).toBe('71.25');
  });
});
