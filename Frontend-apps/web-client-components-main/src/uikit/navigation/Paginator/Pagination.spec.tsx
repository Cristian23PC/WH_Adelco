import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ELLIPSIS, getPaginatorElements } from './helpers';
import Page from './Page';
import Paginator from './Paginator';

describe('Pagination', () => {
  describe('getPaginatorElements', () => {
    it('Should return elements with 5 pages', () => {
      const elements = getPaginatorElements(5, 1);
      expect(elements).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it('Should return elements with less than 5 pages', () => {
      const elements = getPaginatorElements(3, 1);
      expect(elements).toStrictEqual([1, 2, 3]);
    });

    it('Should return elements with more than 5 pages and page 1 active', () => {
      const elements = getPaginatorElements(10, 1);
      expect(elements).toStrictEqual([1, 2, 3, ELLIPSIS, 10]);
    });

    it('Should return elements with more than 5 pages and page 5 active', () => {
      const elements = getPaginatorElements(10, 5);
      expect(elements).toStrictEqual([1, ELLIPSIS, 5, ELLIPSIS, 10]);
    });

    it('Should return elements with more than 5 pages and page 8 active', () => {
      const elements = getPaginatorElements(10, 8);
      expect(elements).toStrictEqual([1, ELLIPSIS, 8, 9, 10]);
    });
  });

  describe('Page', () => {
    it('Should render component with page number', () => {
      const fn = jest.fn();
      render(<Page pageValue={1} onClick={fn} />);

      const element = screen.getByTestId('page-1');
      const classList = element.getAttribute('class');

      expect(element).toBeInTheDocument();
      expect(classList).toContain('w-9');
      expect(classList).toContain('h-9');
      expect(classList).toContain('rounded-full');
      expect(classList).toContain('cursor-pointer');

      fireEvent.click(element);

      expect(fn).toHaveBeenCalledWith(1);
    });

    it('Should render ellipsis', () => {
      const fn = jest.fn();
      render(<Page pageValue={ELLIPSIS} onClick={fn} />);

      const element = screen.getByTestId(`page-${ELLIPSIS}`);

      expect(element).toBeInTheDocument();

      fireEvent.click(element);

      expect(fn).not.toHaveBeenCalled();
    });

    it('Should render active element', () => {
      render(<Page pageValue={1} onClick={() => null} active />);

      const element = screen.getByTestId(`page-${1}`);

      expect(element).toBeInTheDocument();
      expect(element.getAttribute('class')).toContain('bg-snow');
    });
  });

  describe('Paginator', () => {
    it('Should render', async () => {
      render(
        <Paginator totalPages={10} currentPage={1} onClick={() => null} />
      );

      const element = screen.getByTestId('paginator');
      const classList = element.getAttribute('class');

      expect(element).toBeInTheDocument();
      expect(classList).toContain('w-80');
      expect(classList).toContain('desktop:w-[380px]');
      expect(classList).toContain('flex');
      expect(classList).toContain('justify-evenly');

      expect(
        await screen.findByTestId('navigator-btn-mobile-back')
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('navigator-btn-tablet-back')
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('navigator-btn-mobile-next')
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('navigator-btn-tablet-next')
      ).toBeInTheDocument();
    });

    it('Should navigate', async () => {
      const fn = jest.fn();
      render(<Paginator totalPages={10} currentPage={2} onClick={fn} />);

      const mobileBack = await screen.findByTestId('navigator-btn-mobile-back');
      const mobileNext = await screen.findByTestId('navigator-btn-mobile-next');
      const tabletBack = await screen.findByTestId('navigator-btn-tablet-back');
      const tabletNext = await screen.findByTestId('navigator-btn-tablet-next');

      fireEvent.click(mobileBack);
      expect(fn).toBeCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith(1);

      fireEvent.click(mobileNext);
      expect(fn).toBeCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith(3);

      fireEvent.click(tabletBack);
      expect(fn).toBeCalledTimes(3);
      expect(fn).toHaveBeenLastCalledWith(1);

      fireEvent.click(tabletNext);
      expect(fn).toBeCalledTimes(4);
      expect(fn).toHaveBeenLastCalledWith(3);
    });
  });
});
