import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Searchbox from './Searchbox';
import * as useScreen from '../../../utils/hooks/useScreen';

jest.spyOn(useScreen, 'default').mockImplementation(() => ({
  isDesktop: false,
  isMobile: true,
  isTablet: false
}));
const onSearchMock = jest.fn();
const onTypeSearchMock = jest.fn();

describe('Searchbox', () => {
  const lastSearched = ['Mate', 'Piña', 'Agua'];
  const suggestionList = ['Durex', 'Rexona', 'Agorex'];
  it('should render the component', async () => {
    const args = {
      placeholder: 'Search',
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock
    };
    render(<Searchbox {...args} />);
    const element = await screen.findByTestId('adelco-searchbox');
    expect(element).toBeInTheDocument();
  });
  it('should open the flyout with last searched terms when click the input', async () => {
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      lastSearched,
      flyoutOpen: true
    };
    render(<Searchbox {...args} />);
    await waitFor(async () => {
      const flyout = await screen.findByTestId('adelco-search-flyout');
      expect(flyout).toBeInTheDocument();
      const listElement = await screen.findByText(lastSearched[1]);
      expect(listElement).toBeInTheDocument();
    });
  });
  it('should display suggestions instead of last searched terms', async () => {
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      lastSearched,
      suggestionList,
      flyoutOpen: true
    };
    render(<Searchbox {...args} />);
    await waitFor(async () => {
      const listElement = await screen.findByText(suggestionList[1]);
      expect(listElement).toBeInTheDocument();
    });
  });
  it('should call the correct function after clicking a suggested option', async () => {
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      lastSearched,
      suggestionList,
      flyoutOpen: true
    };
    render(<Searchbox {...args} />);
    await waitFor(async () => {
      const listElement = await screen.findByText(suggestionList[1]);
      fireEvent.click(listElement);
      expect(onSearchMock).toHaveBeenCalledWith(suggestionList[1]);
    });
  });
  it('should call the search function by clicking the search button', async () => {
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      lastSearched,
      suggestionList,
      value: 'value'
    };
    render(<Searchbox {...args} />);
    const button = await screen.findByTestId('adelco-button');
    fireEvent.click(button);
    expect(onSearchMock).toHaveBeenCalled();
  });
  it('should call the correct function after typing', async () => {
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      lastSearched,
      suggestionList
    };
    render(<Searchbox {...args} />);
    const input = await screen.findByTestId('adelco-searchbox');
    fireEvent.change(input, { target: { value: 'rex' } });
    await waitFor(async () => {
      expect(onTypeSearchMock).toHaveBeenLastCalledWith('rex');
    });
  });
  it('should call the search fn after pressing enter', async () => {
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      lastSearched,
      suggestionList
    };
    render(<Searchbox {...args} />);
    const input = await screen.findByTestId('adelco-searchbox');
    fireEvent.change(input, { target: { value: 'rex' } });
    fireEvent.submit(input);
    expect(onSearchMock).toHaveBeenCalled();
  });
  it('should not call the function if value is not at least 3 letters long', async () => {
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      lastSearched,
      suggestionList
    };
    render(<Searchbox {...args} />);
    const input = await screen.findByTestId('adelco-searchbox');
    fireEvent.change(input, { target: { value: 're' } });
    await waitFor(async () => {
      expect(onTypeSearchMock).not.toHaveBeenLastCalledWith();
    });
  });
  it('should call onFlyoutClose by clicking close icon', async () => {
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      lastSearched,
      suggestionList,
      flyoutOpen: true,
      onFlyoutClose: jest.fn()
    };
    render(<Searchbox {...args} />);

    await waitFor(async () => {
      const flyout = await screen.findByTestId('adelco-search-flyout');
      expect(flyout).toBeInTheDocument();
    });

    const closeIcon = await screen.findAllByTestId('icon-close');
    expect(closeIcon[0]).toBeInTheDocument();

    fireEvent.click(closeIcon[0]);
    expect(args.onFlyoutClose).toHaveBeenCalled();
  });
  it('should display value prop if passed', async () => {
    const defaultValue = 'Leche';
    const args = {
      onSearch: onSearchMock,
      onTypeSearch: onTypeSearchMock,
      value: defaultValue,
      lastSearched,
      suggestionList
    };
    render(<Searchbox {...args} />);
    const input = await screen.findByTestId('adelco-searchbox');
    expect(input).toHaveValue(defaultValue);
  });
});
