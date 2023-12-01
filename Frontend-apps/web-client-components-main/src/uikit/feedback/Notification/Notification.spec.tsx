import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from './Notification';

describe('Notification', () => {
  it('should render', () => {
    render(<Notification title="title" text="text" type="warning" />);

    expect(screen.getByTestId('adelco-notification')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('Should render warning', () => {
    render(<Notification title="title" text="text" type="warning" />);

    expect(screen.getByTestId('adelco-notification')).toHaveClass(
      'bg-warning-light'
    );
  });

  it('Should render success', () => {
    render(<Notification title="title" text="text" type="success" />);

    expect(screen.getByTestId('adelco-notification')).toHaveClass(
      'bg-success-light'
    );
  });

  it('Should render failure', () => {
    render(<Notification title="title" text="text" type="failure" />);

    expect(screen.getByTestId('adelco-notification')).toHaveClass(
      'bg-failure-light'
    );
  });
});
