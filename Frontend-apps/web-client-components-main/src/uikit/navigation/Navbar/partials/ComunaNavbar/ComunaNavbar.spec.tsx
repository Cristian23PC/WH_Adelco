import React, { type FC } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ComunaNavbar, { type ComunaNavbarProps } from './ComunaNavbar';

const Component: FC<Partial<ComunaNavbarProps>> = (props) => (
  <ComunaNavbar
    isLoggedIn={false}
    screenSize={{ isMobile: true, isTablet: false, isDesktop: false }}
    {...props}
  />
);

describe('ComunaNavbar', () => {
  describe('render', () => {
    it('should render the correct message if there is no label', async () => {
      await act(async () => {
        render(<Component />);
      });

      expect(screen.queryByTestId('zone-label')).not.toBeInTheDocument();
    });

    it('should render the correct label if is present', async () => {
      const label = 'Santiago';
      await act(async () => {
        render(<Component zoneLabel={label} />);
      });

      expect(screen.queryByTestId('zone-label')).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should call onClick if there is no label', async () => {
      const label = 'Santiago';
      const onClickSpy = jest.fn();

      await act(async () => {
        render(<Component zoneLabel={label} />);
      });

      fireEvent.click(screen.getByText(label));

      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it('Should call onClickAddress if there is label and isLogged', async () => {
      const onClickAddressSpy = jest.fn();
      const label = 'Santiago';

      await act(async () => {
        render(
          <Component
            zoneLabel={label}
            isLoggedIn
            onClickAddress={onClickAddressSpy}
          />
        );
      });

      fireEvent.click(screen.getByText(label));

      expect(onClickAddressSpy).toHaveBeenCalled();
    });
  });
});
