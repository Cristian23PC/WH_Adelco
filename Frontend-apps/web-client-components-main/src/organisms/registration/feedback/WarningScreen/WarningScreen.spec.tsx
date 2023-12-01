import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import WarningScreen from './WarningScreen';
import AlreadyRegisteredScreen from './AlreadyRegisteredScreen/AlreadyRegisteredScreen';
import { linkRendererMock } from '../../../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';
import UnableCreateAccountScreen from './UnableCreateAccountScreen/UnableCreateAccountScreen';
import EmailMismatchScreen from './EmailMismatchScreen/EmailMismatchScreen';

describe('WarningScreen', () => {
  const callCenter = '600 600 6363';
  const whatsAppLink = '#';
  describe('Warning Screen Component', () => {
    it('Should render done variant', async () => {
      const title = 'title';
      const body = 'body';
      render(
        <WarningScreen variant="done" title={title}>
          {body}
        </WarningScreen>
      );

      expect(screen.getByTestId('warning-screen')).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(body)).toBeInTheDocument();
      expect(await screen.findByTestId('icon-done')).toBeInTheDocument();
    });

    it('Should render error variant', async () => {
      const title = 'title';
      const body = 'body';
      render(
        <WarningScreen variant="error" title={title}>
          {body}
        </WarningScreen>
      );

      expect(screen.getByTestId('warning-screen')).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(body)).toBeInTheDocument();
      expect(await screen.findByTestId('icon-error')).toBeInTheDocument();
    });
  });

  describe('Already Registered Screen', () => {
    it('Should render', async () => {
      render(<AlreadyRegisteredScreen onLogin={() => {}} />);

      expect(
        screen.getByTestId('already-registered-screen')
      ).toBeInTheDocument();
      expect(await screen.findByTestId('icon-done')).toBeInTheDocument();
    });

    it('Should call login action', async () => {
      const onLogin = jest.fn();
      render(<AlreadyRegisteredScreen onLogin={onLogin} />);

      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(onLogin).toHaveBeenCalled();
    });
  });

  describe('Unable Create Account Screen', () => {
    it('Should render', async () => {
      render(
        <UnableCreateAccountScreen
          onTryAgain={() => {}}
          linkRenderer={linkRendererMock}
          callCenter={callCenter}
          whatsAppLink={whatsAppLink}
        />
      );

      expect(await screen.findByTestId('icon-error')).toBeInTheDocument();
      expect(
        screen.getByTestId('unable-create-account-screen')
      ).toBeInTheDocument();
    });

    it('Should call try again action', () => {
      const onTryAgain = jest.fn();
      render(
        <UnableCreateAccountScreen
          onTryAgain={onTryAgain}
          linkRenderer={linkRendererMock}
          callCenter={callCenter}
          whatsAppLink={whatsAppLink}
        />
      );

      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(onTryAgain).toHaveBeenCalled();
    });
  });

  describe('Email Mismatch Screen', () => {
    it('Should render', async () => {
      render(
        <EmailMismatchScreen
          linkRenderer={linkRendererMock}
          callCenter={callCenter}
          whatsAppLink={whatsAppLink}
        />
      );

      expect(await screen.findByTestId('icon-error')).toBeInTheDocument();
      expect(screen.getByTestId('email-mismatch-screen')).toBeInTheDocument();
    });
  });
});
