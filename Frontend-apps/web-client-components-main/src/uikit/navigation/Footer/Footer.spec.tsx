import React, { type FC } from 'react';
import { render, screen, act } from '@testing-library/react';
import Footer, { type FooterProps } from './Footer';
import footerPropsMock from './FooterProps.mock';

const Component: FC<Partial<FooterProps>> = (props) => {
  return <Footer {...footerPropsMock} {...props} />;
};

describe('Footer', () => {
  it('should render', async () => {
    await act(async () => {
      render(<Component />);
    });
    const footer = screen.getByTestId('adelco-footer');
    expect(footer).toBeInTheDocument();

    const logo = await screen.findByTestId('white-logo');
    expect(logo).toBeInTheDocument();

    expect(screen.getByText(footerPropsMock.address)).toBeInTheDocument();
    expect(screen.getByText(footerPropsMock.email)).toBeInTheDocument();
    expect(screen.getByText(footerPropsMock.phone)).toBeInTheDocument();
  });

  it('should Render social icons', async () => {
    await act(async () => {
      render(<Component />);
    });

    const instagramIcon = await screen.findByTestId('icon-instagram');
    expect(instagramIcon).toBeInTheDocument();

    const facebookIcon = await screen.findByTestId('icon-facebook');
    expect(facebookIcon).toBeInTheDocument();

    const linkedinIcon = await screen.findByTestId('icon-linkedin');
    expect(linkedinIcon).toBeInTheDocument();
  });
});
