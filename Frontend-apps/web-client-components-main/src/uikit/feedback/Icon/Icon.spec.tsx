import React from 'react';
import { render, screen } from '@testing-library/react';
import * as iconNames from './iconNames';
import Icon from './Icon';

describe('Icon', () => {
  it.each(Object.values(iconNames))(
    'should render %s icon correctly',
    async (iconName) => {
      render(<Icon name={iconName} />);

      const icon = await screen.findByTestId('icon-' + iconName);

      expect(icon).toBeInTheDocument();
    }
  );

  it('should set the correct data-testid', async () => {
    const dataTestId = 'test-component';
    render(<Icon name="add" data-testid={dataTestId} />);

    const icon = await screen.findByTestId(dataTestId);

    expect(icon).toBeInTheDocument();
  });
});
