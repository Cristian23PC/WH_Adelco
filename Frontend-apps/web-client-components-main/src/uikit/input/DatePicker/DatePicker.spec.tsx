import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DatePicker from './DatePicker';
import { areDatesEqual, dateToString } from './utils';

describe('DatePicker', () => {
  describe('DatePicker', () => {
    it('should render', () => {
      render(<DatePicker allowPastDates onChange={() => {}} />);

      const datePicker = screen.getByTestId('adelco-date-picker');
      expect(datePicker).toBeInTheDocument();
    });

    it('Should render with date', () => {
      render(
        <DatePicker
          allowPastDates
          onChange={() => {}}
          date={new Date('2023-10-1')}
        />
      );

      expect(screen.getByText('01-10-2023')).toBeInTheDocument();
    });

    it('Should always execute onChange with the clicked date', () => {
      const onChange = jest.fn();
      render(
        <DatePicker
          allowPastDates
          date={new Date('2023-8-28')}
          onChange={onChange}
        />
      );

      const day = screen.getByText('21');

      fireEvent.click(day);

      expect(onChange).toHaveBeenCalled();
    });

    it('Should clear the date when close icon is clicked', () => {
      const onChange = jest.fn();
      render(<DatePicker date={new Date('2023-8-28')} onChange={onChange} />);

      expect(screen.getByText('28-08-2023')).toBeInTheDocument();

      const closeIcon = screen.getByTestId('icon-close');
      fireEvent.click(closeIcon);
      expect(onChange).toHaveBeenCalledWith(undefined);
    });

    it('Should not execute onChange', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-8-28'));
      const onChange = jest.fn();

      render(<DatePicker onChange={onChange} />);

      const pastDay = screen.getByText(15);

      fireEvent.click(pastDay);

      expect(onChange).not.toHaveBeenCalled();

      const futureDay = screen.getByText(29);

      fireEvent.click(futureDay);

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('dateToString', () => {
    it('should return date string', () => {
      const date = new Date('2021-10-18');
      expect(dateToString(date)).toBe('18-10-2021');
    });

    it('Should return a date with two digits', () => {
      const date = new Date('2021-1-1');
      expect(dateToString(date)).toBe('01-01-2021');
    });

    it('Should return a date when receive a string', () => {
      const date = '2021-1-18';
      expect(dateToString(date)).toBe('18-01-2021');
    });
  });

  describe('areDatesEqual', () => {
    it('should return true', () => {
      const date1 = new Date('2021-10-18');
      const date2 = new Date('2021-10-18');
      expect(areDatesEqual(date1, date2)).toBe(true);
    });

    it('should return false', () => {
      const date1 = new Date('2021-10-18');
      const date2 = new Date('2021-10-19');
      expect(areDatesEqual(date1, date2)).toBe(false);
      expect(areDatesEqual(date1, undefined)).toBe(false);
      expect(areDatesEqual(undefined, date2)).toBe(false);
    });
  });
});
