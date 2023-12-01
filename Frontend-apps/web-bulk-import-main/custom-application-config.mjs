import { PERMISSIONS } from './src/constants';
/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptions}
 */
const config = {
  name: 'Custom App Pricing Dev',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: 'gcp-us',
  env: {
    development: {
      initialProjectKey: 'adelco-dev',
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  additionalEnv: {
    bulkImportUrl: '${env:BULK_IMPORT_PRICES_URL}',
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Prices',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
};
export default config;
