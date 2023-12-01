import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NoResults from './NoResults';
import { act } from 'react-dom/test-utils';

describe('No Results', () => {
  it('should render the component', () => {
    render(<NoResults searchedTerm="Mate" onClick={() => {}} />);
    expect(screen.getByTestId('adelco-no-results')).toBeInTheDocument();
  });
  it('should call the onClick fn passed as prop', async () => {
    const clickAction = jest.fn();
    render(<NoResults searchedTerm="Mate" onClick={clickAction} />);
    const clickElement = screen.queryByText('Buscar');
    expect(clickElement).toBeInTheDocument();
    if (clickElement != null) {
      fireEvent.click(clickElement);
      await act(async () => {
        expect(clickAction).toBeCalled();
      });
    }
  });
});
