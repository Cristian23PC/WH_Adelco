import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { Provider } from '@nestjs/common';
import { IRepository } from './interfaces/nest-commercetools-options.interface';
import { NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER } from './nest-commercetools.constants';

export function createNestCommercetoolsProviders(
  repositories: IRepository[] = [],
): Provider[] {
  return repositories.map((repository: IRepository) => ({
    provide: repository,
    useFactory: (byProjectKeyRequestBuilder: ByProjectKeyRequestBuilder) =>
      new repository(byProjectKeyRequestBuilder),
    inject: [NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER],
  }));
}
