import React from 'react';
import WelcomeModal, {
  type WelcomeModalProps,
  DEFAULT_LITERALS as l
} from './WelcomeModal';
import { linkRendererMock } from '../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';
import { act, fireEvent, render, screen } from '@testing-library/react';

const Component: React.FC<Partial<WelcomeModalProps>> = (props) => {
  return (
    <WelcomeModal
      onClose={jest.fn()}
      open
      {...props}
      linkRenderer={linkRendererMock}
      registerLink="/register"
    />
  );
};

describe('WelcomeModal', () => {
  describe('actions', () => {
    const onClickLoginSpy = jest.fn();

    it('should handle onClickLogin when "Inicia sesión" is clicked', () => {
      render(<Component onClickLogin={onClickLoginSpy} />);

      act(() => {
        fireEvent.click(screen.getByText(l.haveAccountLink));
      });

      expect(onClickLoginSpy).toHaveBeenCalled();
    });

    it('should render correct literals', () => {
      render(
        <Component
          literals={{
            title1: 'Hello',
            title2: 'New World',
            subtitle: 'Test subtitle',
            registerButton: 'Test button',
            haveAccount: 'Test account',
            haveAccountLink: 'Test link'
          }}
        />
      );

      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('New World')).toBeInTheDocument();
    });
  });
});
