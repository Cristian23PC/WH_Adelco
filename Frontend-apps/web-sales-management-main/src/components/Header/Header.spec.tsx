import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import Header from './Header';

describe('<Header />', () => {
  it('renders the header label', async () => {
    await act(async () => {
      render(<Header headerLabel="Test Header" ctaLabel="Click Me" />);
    });
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-search')).not.toBeInTheDocument();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
  });

  it('render search field and triggers search on input', async () => {
    const onSearchMock = jest.fn();
    await act(async () => {
      render(<Header headerLabel="Test Header" onSearch={onSearchMock} />);
    });

    const button = await screen.findByTestId('icon-search');
    fireEvent.click(button);
    expect(onSearchMock).toHaveBeenCalled();
  });

  it('renders the button and calls onClick when clicked', async () => {
    const ctaOnClickMock = jest.fn();
    await act(async () => {
      render(
        <Header
          headerLabel="Test Header"
          ctaLabel="Click Me"
          ctaOnClick={ctaOnClickMock}
          onSearch={() => {}}
        />
      );
    });

    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    expect(ctaOnClickMock).toBeCalled();
  });
});
