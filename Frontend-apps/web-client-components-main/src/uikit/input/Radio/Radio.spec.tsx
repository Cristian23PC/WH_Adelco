import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Radio from './Radio';

describe('Radio', () => {
  it('should render', () => {
    render(<Radio onChange={() => {}} />);

    const radio = screen.getByTestId('adelco-radio-button');

    expect(radio).toBeInTheDocument();
    expect(radio).toHaveClass(
      'flex items-center justify-center shrink-0 rounded-full cursor-pointer'
    );
    expect(radio.children[0]).toHaveClass('rounded-full bg-black');
    const input = screen.getByRole('radio');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('opacity-0 absolute cursor-pointer');
  });

  it('Should render with sm size', () => {
    render(<Radio onChange={() => {}} variant="sm" />);
    const radio = screen.getByTestId('adelco-radio-button');
    expect(radio).toHaveClass('w-[26px] h-[26px]');
    expect(radio.children[0]).toHaveClass('w-4 h-4');
  });

  it('Should render with md size', () => {
    render(<Radio onChange={() => {}} variant="md" />);
    const radio = screen.getByTestId('adelco-radio-button');
    expect(radio).toHaveClass('w-[34px] h-[34px]');
    expect(radio.children[0]).toHaveClass('w-[18px] h-[18px]');
  });

  it('Should render with lg size', () => {
    render(<Radio onChange={() => {}} variant="lg" />);
    const radio = screen.getByTestId('adelco-radio-button');
    expect(radio).toHaveClass('w-[42px] h-[42px]');
    expect(radio.children[0]).toHaveClass('w-6 h-6');
  });

  it('Should render with checked', () => {
    render(<Radio onChange={() => {}} checked />);
    const radio = screen.getByTestId('adelco-radio-button');
    expect(radio).toHaveClass('bg-corporative-01');
    expect(radio.children[0]).not.toHaveClass('opacity-0');
    expect(radio.children[1]).toHaveAttribute('checked');
  });

  it('Should render with unchecked', () => {
    render(<Radio onChange={() => {}} checked={false} />);
    const radio = screen.getByTestId('adelco-radio-button');
    expect(radio).toHaveClass('bg-snow');
    expect(radio.children[0]).toHaveClass('opacity-0');
    expect(radio.children[1]).not.toHaveAttribute('checked');
  });

  it('Should call onChange when click', () => {
    const onChange = jest.fn();
    render(<Radio value="data" onChange={onChange} />);
    const radio = screen.getByTestId('adelco-radio-button');

    fireEvent.click(radio);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'change',
        target: expect.objectContaining({
          value: 'data'
        })
      })
    );
  });
});
