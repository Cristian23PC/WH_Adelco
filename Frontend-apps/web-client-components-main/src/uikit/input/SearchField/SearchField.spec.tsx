import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchField from './SearchField';
import * as useScreen from '../../../utils/hooks/useScreen';

jest.spyOn(useScreen, 'default').mockImplementation(() => ({
  isDesktop: false,
  isMobile: true,
  isTablet: false
}));
const onSearchMock = jest.fn();
const onTypeSearchMock = jest.fn();

describe('Searchbox', () => {
  it('should render the component', async () => {
    const args = {
      placeholder: 'Search',
      onSearch: onSearchMock
    };
    render(<SearchField {...args} />);
    const element = await screen.findByTestId('adelco-searchfield');
    expect(element).toBeInTheDocument();
  });
  it('should call the search function by clicking the search button', async () => {
    const args = {
      onSearch: onSearchMock,
      value: 'value'
    };
    render(<SearchField {...args} />);
    const button = await screen.findByTestId('adelco-button');
    fireEvent.click(button);
    expect(onSearchMock).toHaveBeenCalled();
  });

  it('should call the search fn after pressing enter', async () => {
    const args = {
      onSearch: onSearchMock
    };
    render(<SearchField {...args} />);
    const input = await screen.findByTestId('adelco-searchfield');
    fireEvent.change(input, { target: { value: 'rex' } });
    fireEvent.submit(input);
    expect(onSearchMock).toHaveBeenCalled();
  });

  it('should display value prop if passed', async () => {
    const defaultValue = 'Leche';
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      value: defaultValue
    };
    render(<SearchField {...args} />);
    const input = await screen.findByTestId('adelco-searchfield');
    expect(input).toHaveValue(defaultValue);
  });
});
