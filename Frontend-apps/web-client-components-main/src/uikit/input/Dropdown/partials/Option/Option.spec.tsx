import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Option from './Option';

const onClickMock = jest.fn();

describe('Option', () => {
  it('should render the component', () => {
    render(<Option onClick={onClickMock}>Option 1</Option>);
    expect(screen.getByTestId('adelco-dropdown-option'));
  });
  it('should display bold label when prop is true', () => {
    render(
      <Option onClick={onClickMock} isSelected>
        Option 1
      </Option>
    );
    expect(screen.getByTestId('adelco-dropdown-option')).toHaveClass(
      'font-bold'
    );
  });
  it('should call onClick fn', () => {
    render(<Option onClick={onClickMock}>Option 1</Option>);
    const option = screen.getByTestId('adelco-dropdown-option');
    fireEvent.click(option);
    expect(onClickMock).toHaveBeenCalled();
  });
});
