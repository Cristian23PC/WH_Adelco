import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OptionRadio from './OptionRadio';

describe('OptionRadio', () => {
  it('should render', () => {
    render(<OptionRadio onChange={() => {}} label="label" />);

    expect(screen.getByTestId('adelco-option-radio')).toBeInTheDocument();
    expect(screen.getByText('label')).toBeInTheDocument();

    const radioButtonSm = screen.getByTestId('adelco-radio-button-sm');
    expect(radioButtonSm).toBeInTheDocument();
    expect(radioButtonSm).toHaveClass('tablet:hidden desktop:flex');
    expect(radioButtonSm).toHaveClass('w-[26px] h-[26px]');

    const radioButtonMd = screen.getByTestId('adelco-radio-button-md');
    expect(radioButtonMd).toBeInTheDocument();
    expect(radioButtonMd).toHaveClass(
      'mobile:hidden tablet:flex desktop:hidden'
    );
    expect(radioButtonMd).toHaveClass('w-[34px] h-[34px]');
  });

  it('Should render proper styles', () => {
    render(<OptionRadio onChange={() => {}} label="label" />);

    const optionRadio = screen.getByTestId('adelco-option-radio');
    expect(optionRadio).toHaveClass(
      'flex items-center ring-1 ring-inset ring-snow rounded-[10px] p-2 tablet:px-4 gap-2 cursor-pointer'
    );

    expect(screen.getByText('label')).toHaveClass('cursor-pointer');
  });

  it('Should execute onChange clicking on label without id', () => {
    const onChange = jest.fn();
    render(<OptionRadio value="1" label="label" onChange={onChange} />);

    const optionRadio = screen.getByTestId('adelco-option-radio');

    fireEvent.click(optionRadio);

    expect(onChange).toBeCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: '1'
        })
      })
    );
  });

  it('Should execute onChange clicking on label with id', () => {
    const onChange = jest.fn();
    render(<OptionRadio value="1" id="id" label="label" onChange={onChange} />);

    const optionRadio = screen.getByTestId('adelco-option-radio');

    fireEvent.click(optionRadio);

    expect(onChange).toBeCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: '1'
        })
      })
    );
  });
});
