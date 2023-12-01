import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlyoutTooltip from './FlyoutTooltip';

const onCloseMock = jest.fn();
const onClickMock = jest.fn();

describe('Flyout Tooltip', () => {
  it('should render the component without any cta component', async () => {
    const testId = 'adelco-flyout-tooltip';
    const message = 'this is a message for a tooltip';
    render(<FlyoutTooltip message={message} onClose={() => {}} />);
    const element = await screen.findByTestId(testId);
    expect(element).toBeInTheDocument();
  });
  it('should render the component with a button if a function is passed as prop', async () => {
    const testId = 'adelco-flyout-tooltip';
    const message = 'this is a message for a tooltip';
    const compoMsg = 'This is a button';
    render(
      <FlyoutTooltip
        message={message}
        onClose={() => {}}
        onClick={onClickMock}
        buttonLabel={compoMsg}
      />
    );
    const element = await screen.findByTestId(testId);
    expect(element).toBeInTheDocument();
    const btnMessage = await screen.findByText(compoMsg);
    expect(btnMessage).toBeInTheDocument();
    fireEvent.click(btnMessage);
    expect(onClickMock).toHaveBeenCalled();
  });
  it('should call onClose function', async () => {
    const testId = 'adelco-flyout-tooltip';
    const message = 'this is a message for a tooltip';
    render(<FlyoutTooltip message={message} onClose={onCloseMock} />);
    const element = await screen.findByTestId(testId);
    const icons = element.querySelectorAll('svg');
    expect(icons.length).toBe(2);
    fireEvent.click(icons[0]);
    expect(onCloseMock).toHaveBeenCalled();
    fireEvent.click(icons[1]);
    expect(onCloseMock).toHaveBeenCalled();
  });
});
