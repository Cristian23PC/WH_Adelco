import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Inject, Injectable } from '@nestjs/common';
import { SecretManagerModuleOptions } from './interfaces';
import { GCP_SCRT_MANAGER_MODULE_OPTIONS } from './secret-manager.constants';

@Injectable()
export class SecretManagerService {
  private readonly projectId: string;
  private readonly client: SecretManagerServiceClient;

  constructor(
    @Inject(GCP_SCRT_MANAGER_MODULE_OPTIONS)
    options: SecretManagerModuleOptions
  ) {
    this.projectId = options.projectId;
    this.client = new SecretManagerServiceClient();
  }

  async get<T>(secret: string): Promise<T> {
    const [response] = await this.client.accessSecretVersion({
      name: `projects/${this.projectId}/secrets/${secret}/versions/latest`
    });
    const data = response.payload?.data?.toString();
    try {
      return JSON.parse(data);
    } catch (error) {
      return data as unknown as T;
    }
  }
}
