import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateVerificationCodeData, getVerificationCode } from '@/common/utils/parser/parser';
import { IEnvironmentKeycloak, KeycloakUserCreationResponse, KeycloakToken, KeycloakUser } from './interfaces/keycloak.interface';
import { SecretManagerService } from '../secret-manager';
import { NotificationsService } from '@/notifications';

@Injectable()
export class KeycloakService {
  private host: string;
  private realm: string;
  private maxVerificationCodeFailures: number;
  constructor(private configService: ConfigService, private secretManagerService: SecretManagerService, private notificationsService: NotificationsService) {
    this.host = this.configService.get<string>('keycloak.host');
    this.realm = this.configService.get<string>('keycloak.realm');
    this.maxVerificationCodeFailures = this.configService.get<number>('keycloak.maxVerificationCodeFailures');
  }

  async getAuthToken(): Promise<KeycloakToken> {
    const { clientId, clientSecret } = this.configService.get<IEnvironmentKeycloak>('keycloak');
    const clientSecretValue: string = await this.secretManagerService.get(clientSecret);
    const url = `${this.host}/realms/${this.realm}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecretValue}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    return response.json();
  }

  async getByUsername(username: string, access_token: string): Promise<KeycloakUser[]> {
    const url = `${this.host}/admin/realms/${this.realm}/users?username=${encodeURIComponent(username)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      redirect: 'follow'
    });
    if (!response.ok) {
      throw new HttpException(response.statusText, response.status);
    }
    return await response.json();
  }

  async createUser(userDraft: Partial<KeycloakUser>, access_token: string): Promise<KeycloakUserCreationResponse> {
    const url = `${this.host}/admin/realms/${this.realm}/users`;

    const verificationCodeData = generateVerificationCodeData();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userDraft,
        attributes: {
          ...userDraft.attributes,
          verificationCodeData,
          remainingAttempts: this.maxVerificationCodeFailures
        },
        enabled: true
      })
    });
    if (!response.ok) {
      throw new HttpException(response.statusText, response.status);
    }

    const { verificationCode } = getVerificationCode(verificationCodeData);

    await this.notificationsService.sendNotification({
      to: [{ email: userDraft.email, name: userDraft.username }],
      notificationType: 'MAIL_VERIFICATION_CODE',
      templateData: { code: verificationCode }
    });

    return {
      status: response.status,
      message: `Username "${userDraft.username}" successfully created.`
    };
  }

  async resetPassword(userId: string, rawPassword: string, access_token: string): Promise<void> {
    const url = `${this.host}/admin/realms/${this.realm}/users/${userId}/reset-password`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        credentialData: 'password',
        value: rawPassword
      })
    });

    if (!response.ok) {
      throw new HttpException(response.statusText, response.status);
    }
  }

  async generateVerificationCode(username: string): Promise<void> {
    const { access_token } = await this.getAuthToken();

    const [keycloakUser] = await this.getByUsername(username, access_token);
    if (!keycloakUser) {
      throw new NotFoundException('User does not exist');
    }

    const verificationCodeData = generateVerificationCodeData();
    const { verificationCode } = getVerificationCode(verificationCodeData);

    await Promise.all([
      this.updateUser(keycloakUser.id, access_token, {
        attributes: { ...keycloakUser.attributes, verificationCodeData: [verificationCodeData], remainingAttempts: [`${this.maxVerificationCodeFailures}`] }
      })
    ]);

    await this.notificationsService.sendNotification({
      to: [{ email: keycloakUser.email, name: keycloakUser.username }],
      notificationType: 'PASSWORD_RECOVERY_CODE',
      templateData: { code: verificationCode }
    });
  }

  async updateUser(userId: string, access_token: string, body: Partial<KeycloakUser>) {
    const url = `${this.host}/admin/realms/${this.realm}/users/${userId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...body })
    });
    if (!response.ok) {
      throw new HttpException(response.statusText, response.status);
    }
  }
}
