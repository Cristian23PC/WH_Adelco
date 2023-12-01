import {
  renderApplication,
  renderApplicationWithRoutes,
  renderApplicationWithRoutesAndRedux,
  mergeWithDefaultOptions,
} from './';
import Routes from '../routes';
import { screen } from '@testing-library/react';
import {
  TRenderAppOptions,
  TRenderAppWithReduxOptions,
  mapResourceAccessToAppliedPermissions,
} from '@commercetools-frontend/application-shell/test-utils';
import { PERMISSIONS, entryPointUriPath } from '../constants';
import { useChannelsFetcher } from '../hooks/use-channels-connector';
import { createApolloClient } from '@commercetools-frontend/application-shell';

jest.mock('../hooks/use-channels-connector');

describe('Render App hooks', () => {
  beforeEach(() => {
    (useChannelsFetcher as jest.Mock).mockReturnValue({
      channelsPaginatedResult: undefined,
      error: undefined,
      loading: true,
    });
  });
  it('should render Routes with renderApplication', async () => {
    jest.spyOn(console, 'log').mockImplementation();
    const route = `/my-project/${entryPointUriPath}`;
    renderApplication(<Routes />, {
      route,
      project: {
        allAppliedPermissions: mapResourceAccessToAppliedPermissions([
          PERMISSIONS.View,
        ]),
      },
    });

    expect(await screen.findByText('Seleccionar archivo')).toBeInTheDocument();
  });
  it('should render renderApplicationWithRoutes with renderApplication', async () => {
    jest.spyOn(console, 'log').mockImplementation();
    const route = `/my-project/${entryPointUriPath}`;
    renderApplicationWithRoutes({
      route,
      project: {
        allAppliedPermissions: mapResourceAccessToAppliedPermissions([
          PERMISSIONS.View,
        ]),
      },
    });

    expect(await screen.findByText('Seleccionar archivo')).toBeInTheDocument();
  });
  it('should render Routes with renderApplicationWithRoutesAndRedux', async () => {
    jest.spyOn(console, 'log').mockImplementation();
    const route = `/my-project/${entryPointUriPath}`;
    renderApplicationWithRoutesAndRedux({
      route,
      project: {
        allAppliedPermissions: mapResourceAccessToAppliedPermissions([
          PERMISSIONS.View,
        ]),
      },
    });

    expect(await screen.findByText('Seleccionar archivo')).toBeInTheDocument();
  });

  describe('mergeWithDefaultOptions Function', () => {
    it('should merge options with default values', () => {
      jest.spyOn(console, 'log').mockImplementation();
      const options:
        | Partial<TRenderAppOptions>
        | Partial<TRenderAppWithReduxOptions> = {
        environment: {},
        apolloClient: createApolloClient(),
      };

      const mergedOptions = mergeWithDefaultOptions(options);

      expect(mergedOptions?.environment?.entryPointUriPath).toBeDefined();
      expect(mergedOptions.apolloClient).toBeDefined();
    });

    it('should use default values if no options provided', () => {
      jest.spyOn(console, 'log').mockImplementation();
      const mergedOptions = mergeWithDefaultOptions();

      expect(mergedOptions?.environment?.entryPointUriPath).toBeDefined();
      expect(mergedOptions.apolloClient).toBeDefined();
    });
  });
});
