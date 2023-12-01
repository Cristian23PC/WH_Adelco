import React from 'react';
import { render, screen, act } from '@testing-library/react';
import * as flagNames from './flagNames';
import Flag from './Flag';

describe('Flag', () => {
  it.each(Object.values(flagNames))(
    'should render %s flag correctly',
    async (flagName) => {
      await act(async () => {
        render(<Flag name={flagName} />);
      });

      const flag = screen.getByTestId('flag-' + flagName);

      expect(flag).toBeInTheDocument();
    }
  );

  it('should set the correct data-testid', async () => {
    const dataTestId = 'test-component';

    await act(async () => {
      render(<Flag name="cl" data-testid={dataTestId} />);
    });

    const flag = screen.getByTestId(dataTestId);

    expect(flag).toBeInTheDocument();
  });
});
