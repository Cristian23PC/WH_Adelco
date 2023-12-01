import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CodeValidationForm from './CodeValidationForm';
import ResendCode from './partials/ResendCode';
import RequestNewCode from './partials/RequestNewCode';

const mockLiterals = {
  bodyMessage: 'Enter the code we sent to your phone',
  notSentMessage: 'Not sent?',
  resendText: 'Resend',
  requestNewCode: 'Request new code'
};

describe('CodeValidationForm', () => {
  it('should render component', () => {
    const email = 'email@adelco.cl';
    render(
      <CodeValidationForm
        emailAddress={email}
        onResend={() => {}}
        onSubmit={() => {}}
        literals={mockLiterals}
      />
    );

    const form = screen.getByTestId('adelco-code-validation-form');
    expect(form).toBeInTheDocument();

    const bodyMessage = screen.getByText(mockLiterals.bodyMessage);
    expect(bodyMessage).toBeInTheDocument();

    const notSent = screen.getByText(mockLiterals.notSentMessage);
    expect(notSent).toBeInTheDocument();

    const resend = screen.getByText(mockLiterals.resendText);
    expect(resend).toBeInTheDocument();
  });

  it('Should render error message', () => {
    const errorMessage = 'Error message';
    render(
      <CodeValidationForm
        emailAddress=""
        onSubmit={() => {}}
        onResend={() => {}}
        errorMessage={errorMessage}
      />
    );

    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
  });

  it('Should render without limitExceeded', () => {
    render(
      <CodeValidationForm
        emailAddress=""
        onSubmit={() => {}}
        onResend={() => {}}
      />
    );

    const requestNewCode = screen.queryByTestId('adelco-request-new-code');
    expect(requestNewCode).not.toBeInTheDocument();

    const resendCode = screen.getByTestId('adelco-resend-code');
    expect(resendCode).toBeInTheDocument();
  });

  it('Should render with limitExceeded', () => {
    render(
      <CodeValidationForm
        emailAddress=""
        onSubmit={() => {}}
        onResend={() => {}}
        limitExceeded
      />
    );

    const requestNewCode = screen.getByTestId('adelco-request-new-code');
    expect(requestNewCode).toBeInTheDocument();

    const resendCode = screen.queryByTestId('adelco-resend-code');
    expect(resendCode).not.toBeInTheDocument();
  });

  describe('ResendCode', () => {
    it('Should render ResendCode component', () => {
      render(<ResendCode onResend={() => {}} literals={mockLiterals} />);

      const resend = screen.getByTestId('adelco-resend-code');
      expect(resend).toBeInTheDocument();
    });

    it('Should execute onResend function', () => {
      const onResend = jest.fn();
      render(<ResendCode onResend={onResend} literals={mockLiterals} />);

      const resend = screen.getByText(mockLiterals.resendText);
      fireEvent.click(resend);

      expect(onResend).toHaveBeenCalled();
    });
  });

  describe('RequestNewCode', () => {
    it('Should render RequestNewCode component', () => {
      render(
        <RequestNewCode literals={mockLiterals} onRequestNewCode={() => {}} />
      );
      const requestNewCode = screen.getByTestId('adelco-request-new-code');
      expect(requestNewCode).toBeInTheDocument();
    });

    it('Should execute onRequestNewCode function', () => {
      const onRequestNewCode = jest.fn();
      render(
        <RequestNewCode
          literals={mockLiterals}
          onRequestNewCode={onRequestNewCode}
        />
      );

      const requestNewCode = screen.getByText(mockLiterals.requestNewCode);
      fireEvent.click(requestNewCode);

      expect(onRequestNewCode).toHaveBeenCalled();
    });
  });
});
