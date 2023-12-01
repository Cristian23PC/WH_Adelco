import { Environment } from '@/config/enums/environment.enum';
import { IIntegrations } from '@/config/interfaces/integrations.interface';

export interface IAppConfig {
  environment: Environment;
  projectName: string;
  rootPath: string;
  appPort: number;
  integrations: IIntegrations;
}
