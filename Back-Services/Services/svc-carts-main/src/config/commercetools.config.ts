import { registerAs } from '@nestjs/config';

export default registerAs('commercetools', () => ({
  auth: {
    host: process.env.CT_AUTH_URL,
    projectKey: process.env.CT_PROJECT_KEY,
    credentials: {
      clientId: process.env.CT_CLIENT_ID,
      clientSecret: process.env.CT_CLIENT_SECRET
    }
  },
  http: {
    host: process.env.CT_API_URL,
    enableRetry: true,
    retryConfig: {
      maxRetries: 3
    }
  },
  ...(process.env.CT_CONCURRENCY && {
    queue: { concurrency: +process.env.CT_CONCURRENCY }
  }),
  projectKey: process.env.CT_PROJECT_KEY,
  google: {
    project: process.env.GCP_PROJECT,
    ctCredentialsSecretKey: process.env.GCP_CT_CREDENTIALS_NAME
  }
}));
