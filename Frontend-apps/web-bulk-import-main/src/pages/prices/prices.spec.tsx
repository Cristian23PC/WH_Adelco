/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen, fireEvent } from '@testing-library/react';
import {
  TRenderAppWithReduxOptions,
  mapResourceAccessToAppliedPermissions,
} from '@commercetools-frontend/application-shell/test-utils';
import { PERMISSIONS, entryPointUriPath } from '../../constants';
import { renderApplicationWithRedux } from '../../test-utils';
import ApplicationRoutes from '../../routes';
import { useChannelsFetcher } from '../../hooks/use-channels-connector';
import { renderHook } from '@testing-library/react-hooks';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

jest.mock('../../services/merchant-center/merchant-center.service', () => ({
  updatePrices: jest.fn(() => Promise.resolve()),
}));

jest.mock('papaparse');

jest.mock('../../hooks/use-channels-connector', () => ({
  useChannelsFetcher: jest.fn(),
}));

const mockChannels = [
  {
    key: 'channel1',
    roles: ['InventorySupply'],
    nameAllLocales: [{ value: 'Channel 1' }],
  },
  {
    key: 'channel2',
    roles: ['OtherRole'],
    nameAllLocales: [{ value: 'Channel 2' }],
  },
];

const renderApp = (options: Partial<TRenderAppWithReduxOptions> = {}) => {
  const route = options.route || `/my-project/${entryPointUriPath}`;
  const { history } = renderApplicationWithRedux(<ApplicationRoutes />, {
    route,
    project: {
      allAppliedPermissions: mapResourceAccessToAppliedPermissions([
        PERMISSIONS.View,
      ]),
    },
    ...options,
  });
  return { history };
};
describe('Prices', () => {
  it('should render the Prices component with file upload functionality', async () => {
    (useChannelsFetcher as jest.Mock).mockReturnValue({
      channelsPaginatedResult: undefined,
      error: undefined,
      loading: true,
    });

    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();

    renderApp();

    const fileInput: HTMLInputElement = await screen.findByText(
      'Seleccionar archivo'
    );

    const file = new File(['file content'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files).toHaveLength(1);

    expect(fileInput.files?.[0]).toBe(file);
  });

  describe('Prices Component', () => {
    it('should handle click on "Subir archivo" button and save the file in the "file" state', () => {
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();

      renderApp();

      const uploadButton = screen.getByRole('button', {
        name: /seleccionar archivo/i,
      });
      fireEvent.click(uploadButton);

      const fileInput = screen.getByTestId('input-file-hidden');
      expect(fileInput).toBeInTheDocument();

      const file = new File(['content of the file'], 'example.csv', {
        type: 'text/csv',
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      const { result } = renderHook(() => useState(file));
      const [fileState] = result.current;
      expect(fileState).toEqual(file);
    });

    it('should set rows on file change', () => {
      const file = new File(
        [
          `name,price,quantity\nProduct 1,10,100\nProduct 2,20,200\nProduct 3,30,300`,
        ],
        'products.csv',
        {
          type: 'text/csv',
        }
      );
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();

      renderApp();

      fireEvent.change(screen.getByTestId('input-file-hidden'), {
        target: { files: [file] },
      });

      expect(Papa.parse).toHaveBeenCalledWith(file, {
        header: true,
        complete: expect.any(Function),
        skipEmptyLines: true,
      });

      const parsedData = [
        {
          name: 'Product 1',
          price: '10',
          quantity: '100',
        },
        {
          name: 'Product 2',
          price: '20',
          quantity: '200',
        },
        {
          name: 'Product 3',
          price: '30',
          quantity: '300',
        },
        {
          name: 'Product 4',
          price: '40',
          quantity: '400',
        },
      ];
      const completeCallback = Papa.parse.mock.calls[0][1].complete;
      completeCallback({ data: parsedData });

      const { result } = renderHook(() => useState(parsedData));
      const [rowsState] = result.current;

      expect(rowsState).toHaveLength(4);
    });

    it('should update columns based on rows', async () => {
      const rows = [
        {
          name: 'Product 1',
          price: '10',
          quantity: '100',
        },
        {
          name: 'Product 2',
          price: '20',
          quantity: '200',
        },
        {
          name: 'Product 3',
          price: '30',
          quantity: '300',
        },
      ];
      const callback = jest.fn();

      let { rerender } = renderHook(
        (rows) => useEffect(() => callback(rows as any), [rows]),
        { initialProps: [] }
      );

      const setStateMock = jest.fn();
      const useStateMock: any = (useState: any) => [useState, setStateMock];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);

      rerender({ rows });
      const file = new File(
        [
          `name,price,quantity\nProduct 1,10,100\nProduct 2,20,200\nProduct 3,30,300`,
        ],
        'products.csv',
        {
          type: 'text/csv',
        }
      );
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();

      renderApp();

      fireEvent.change(screen.getByTestId('input-file-hidden'), {
        target: { files: [file] },
      });

      jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
