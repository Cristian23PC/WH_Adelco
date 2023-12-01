import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchFlyout from './SearchFlyout';
import { act } from 'react-dom/test-utils';

const clickAction = jest.fn();

describe('Search Flyout', () => {
  it('should render the component', () => {
    const args = {
      onClick: clickAction,
      suggestionList: ['Rexona', 'Durex', 'Agorex'],
      showFlyout: true
    };
    render(<SearchFlyout {...args} />);
    expect(screen.getByTestId('adelco-search-flyout')).toBeInTheDocument();
  });
  it('should not render the component when showFlyout is false', () => {
    const args = {
      onClick: clickAction,
      suggestionList: ['Rexona', 'Durex', 'Agorex']
    };
    render(<SearchFlyout {...args} />);
    expect(
      screen.queryByTestId('adelco-search-flyout')
    ).not.toBeInTheDocument();
  });
  it('should not render the component when suggestionList is empty', () => {
    const args = {
      onClick: clickAction
    };
    render(<SearchFlyout {...args} />);
    expect(
      screen.queryByTestId('adelco-search-flyout')
    ).not.toBeInTheDocument();
  });
  it('should render a title if passed as prop', () => {
    const title = 'List title';
    const args = {
      onClick: clickAction,
      suggestionList: ['Rexona', 'Durex', 'Agorex'],
      title,
      showFlyout: true
    };
    render(<SearchFlyout {...args} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });
  it('should call prop fn with correct param', async () => {
    const args = {
      onClick: clickAction,
      suggestionList: ['Rexona', 'Durex', 'Agorex'],
      showFlyout: true
    };
    render(<SearchFlyout {...args} />);
    const liElement = screen.getByText('Durex');
    expect(liElement).toBeInTheDocument();
    fireEvent.click(liElement);
    await act(async () => {
      expect(clickAction).toHaveBeenCalledWith('Durex');
    });
  });
});
