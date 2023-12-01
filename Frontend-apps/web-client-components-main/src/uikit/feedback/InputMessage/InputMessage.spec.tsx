import React, { type FC } from 'react';
import { render, screen } from '@testing-library/react';
import InputMessage, { type InputMessageProps } from './InputMessage';
const Component: FC<Partial<InputMessageProps>> = (overwrite) => (
  <InputMessage variant="failure" iconName="error" {...overwrite}>
    {overwrite.children}
  </InputMessage>
);

describe('InputMessage', () => {
  it('Should render the Test message', () => {
    render(<Component variant="failure">Test message</Component>);

    expect(screen.getByText(/Test message/)).toBeInTheDocument();
    expect(screen.getByTestId('adelco-input-message')).toBeInTheDocument();
  });

  it("Shouldn't render the Test message", () => {
    const { container } = render(<Component variant="failure"></Component>);

    expect(
      screen.queryByTestId('adelco-input-message')
    ).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("Shouldn't render the icon when the iconName prop is not provided", () => {
    const { container } = render(
      <Component variant="failure">Test message</Component>
    );
    expect(container.childElementCount).toBe(1);
  });

  it('Should render the icon with the correct color when the variant is failure', async () => {
    render(
      <Component variant="failure" iconName="add">
        Test message
      </Component>
    );

    const icon = await screen.findByTestId('adelco-input-message-icon-add');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fill-failure');
  });

  it('Should render the icon with the correct color when the variant is warning', async () => {
    render(
      <Component variant="warning" iconName="add">
        Test message
      </Component>
    );

    const icon = await screen.findByTestId('adelco-input-message-icon-add');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fill-warning');
  });

  it('Should render the icon with the correct color when the variant is success', async () => {
    render(
      <Component variant="success" iconName="add">
        Test message
      </Component>
    );

    const icon = await screen.findByTestId('adelco-input-message-icon-add');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fill-success');
  });

  it('renders JSX children', async () => {
    render(
      <Component variant="failure">
        <span>JSX Message</span>
        <br />
        <span>In multiple lines</span>
      </Component>
    );

    const messageContainer = screen.getByTestId('adelco-input-message');
    const icon = await screen.findByTestId('adelco-input-message-icon-error');
    const messageTextLine1 = screen.getByText('JSX Message');
    const messageTextLine2 = screen.getByText('In multiple lines');
    expect(messageContainer).toBeInTheDocument();
    expect(messageContainer.lastChild).toHaveClass('text-failure');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fill-failure');
    expect(messageTextLine1).toBeInTheDocument();
    expect(messageTextLine2).toBeInTheDocument();
  });
});
