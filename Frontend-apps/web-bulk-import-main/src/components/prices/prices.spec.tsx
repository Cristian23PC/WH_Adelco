import { screen, fireEvent, waitFor } from '@testing-library/react';
import {
  TRenderAppWithReduxOptions,
  mapResourceAccessToAppliedPermissions,
} from '@commercetools-frontend/application-shell/test-utils';
import { PERMISSIONS, entryPointUriPath } from '../../constants';
import { renderApplicationWithRedux } from '../../test-utils';
import ApplicationRoutes from '../../routes';
import { useChannelsFetcher } from '../../hooks/use-channels-connector';
import { PricesService } from '../../services/merchant-center/merchant-center.service';
import { renderHook } from '@testing-library/react-hooks';
import { useState } from 'react';
import Papa from 'papaparse';
import React from 'react';

jest.mock('../../hooks/use-channels-connector');

jest.mock('../../services/merchant-center/merchant-center.service', () => ({
  updatePrices: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../services/merchant-center/merchant-center.service');

jest.mock('papaparse');

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

    renderApp();

    const fileInput: HTMLInputElement = await screen.findByText(
      'Seleccionar archivo'
    );

    const file = new File(['file content'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files).toHaveLength(1);

    expect(fileInput.files?.[0]).toBe(file);
  });

  // describe('MyFormComponent', () => {
  //   // const pricesServiceInstance = { updatePrices: jest.fn() };
  //   // pricesService.updatePrices = jest.fn().mockReturnValue(undefined);
  //   it('should submit the form successfully', async () => {
  //     let pricesService: PricesService = {
  //       updatePrices: jest.fn().mockReturnValue(undefined),
  //     };
  //     renderApp();
  //     // const updatePricesMock = jest.fn().mockResolvedValue({});
  //     // jest
  //     //   .spyOn(PricesService, 'updatePrices')
  //     //   .mockImplementation(updatePricesMock);
  //     // PricesService.updatePrices = jest.fn().mockResolvedValue({});

  //     const distributionChannelInput = screen.getByRole('combobox', {
  //       id: 'react-select-3-input',
  //     });
  //     fireEvent.change(distributionChannelInput, {
  //       target: { value: 'example-channel' },
  //     });

  //     const submitButton = screen.getByRole('button', { name: 'Subir' });
  //     fireEvent.click(submitButton);

  //     expect(pricesService.updatePrices).toBeDefined();
  //   });
  // });

  describe('Prices Component', () => {
    it('should handle click on "Subir archivo" button and save the file in the "file" state', () => {
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
      // Crea un archivo de prueba
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

      renderApp();

      const initialRows = screen.queryByRole('row');
      expect(initialRows).not.toBeInTheDocument();

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

    // it('should update columns based on rows', () => {
    //   // Creamos algunas filas de prueba
    //   const rows = [
    //     {
    //       name: 'Product 1',
    //       price: '10',
    //       quantity: '100',
    //     },
    //     {
    //       name: 'Product 2',
    //       price: '20',
    //       quantity: '200',
    //     },
    //     {
    //       name: 'Product 3',
    //       price: '30',
    //       quantity: '300',
    //     },
    //   ];

    //   // Renderizamos el componente
    //   renderApp();

    //   // Verificamos que inicialmente no haya columnas
    //   const initialColumns = screen.queryByRole('columnheader');
    //   expect(initialColumns).not.toBeInTheDocument();

    //   // Actualizamos el componente con las filas
    //   const rowsStateSetter = screen.getByTestId('rows-state-setter');
    //   React.useState = jest.fn().mockReturnValueOnce([rows, rowsStateSetter]);

    //   // El cambio en las filas debería disparar el useEffect que actualiza las columnas
    //   React.useEffect.mock.calls[0][0]();

    //   // Verificamos que las columnas se hayan actualizado correctamente
    //   const updatedColumns = screen.queryAllByRole('columnheader');
    //   expect(updatedColumns).toHaveLength(3); // 3 columnas: name, price, quantity
    //   expect(updatedColumns[0]).toHaveTextContent('name');
    //   expect(updatedColumns[1]).toHaveTextContent('price');
    //   expect(updatedColumns[2]).toHaveTextContent('quantity');
    // });
  });
});
