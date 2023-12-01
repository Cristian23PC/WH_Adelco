import { getToken } from './KeyCloakApi';
import axios from 'axios';

jest.mock('axios', () => ({
  default: { get: jest.fn(), post: jest.fn().mockResolvedValue({}) }
}));

describe('getToken', () => {
  it('should call fetch with correct values', async () => {
    await getToken(
      { username: 'foo@foo.com', password: 'foo' },
      {
        URL: 'https://qa-dia.adelco.cl/realms/CUSTOMER/protocol/openid-connect',
        clientId: 'adelco_customers_commercetools_web'
      }
    );

    expect(axios.post).toHaveBeenCalledWith(
      'https://qa-dia.adelco.cl/realms/CUSTOMER/protocol/openid-connect/token',
      expect.anything(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  });

  it('should return access token', async () => {
    (axios.post as any).mockResolvedValueOnce({ data: 'token' });
    const result = await getToken(
      {
        username: 'test@test.com',
        password: 'password'
      },
      {
        URL: 'https://qa-dia.adelco.cl/realms/CUSTOMER/protocol/openid-connect',
        clientId: 'adelco_customers_commercetools_web'
      }
    );
    expect(result).toEqual('token');
  });
});
