import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Tooltip } from './';

describe('Tooltip Component', () => {
  it('should render the Tooltip with the provided text', () => {
    const text = 'This is a tooltip';
    render(
      <Tooltip text={text} open>
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.getByText(text);
    expect(tooltip).toBeInTheDocument();
  });

  it('should not render when "open" prop is false', () => {
    render(
      <Tooltip text="Tooltip Text" open={false}>
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.queryByText('Tooltip Text');
    expect(tooltip).toBeNull();
  });

  it('should apply custom class names', () => {
    const customClassName = 'custom-class';
    render(
      <Tooltip text="Tooltip Text" open className={customClassName}>
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.getByText('Tooltip Text');
    expect(tooltip).toHaveClass(customClassName);
  });

  it('should have a default "top" position', () => {
    render(
      <Tooltip text="Tooltip Text" open>
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.getByText('Tooltip Text');
    expect(tooltip).toHaveClass('-translate-y-full');
  });

  it('should have bottom position', () => {
    render(
      <Tooltip text="Tooltip Text" open position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.getByText('Tooltip Text');
    expect(tooltip).toHaveClass('translate-y-full');
  });
  it('should have bottom position', () => {
    render(
      <Tooltip text="Tooltip Text" open position="left">
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.getByText('Tooltip Text');
    expect(tooltip).toHaveClass('-translate-x-full');
  });
  it('should have bottom position', () => {
    render(
      <Tooltip text="Tooltip Text" open position="right">
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.getByText('Tooltip Text');
    expect(tooltip).toHaveClass('translate-x-full');
  });

  it('should open on hovering over the trigger element when there is not prop open', () => {
    render(
      <Tooltip text="Tooltip Text">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');

    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByText('Tooltip Text');

    expect(tooltip).toBeInTheDocument();
  });

  it('should close on mouse leave from the trigger element when there is not prop open', async () => {
    render(
      <Tooltip text="Tooltip Text">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByText('Tooltip Text');
    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  it('should not have effect mouse enter and mouse leave when there is the prop open', () => {
    render(
      <Tooltip text="Tooltip Text" open>
        <button>Hover me</button>
      </Tooltip>
    );

    const tooltip = screen.getByText('Tooltip Text');
    const trigger = screen.getByText('Hover me');

    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);

    expect(tooltip).toBeInTheDocument();
  });
});
