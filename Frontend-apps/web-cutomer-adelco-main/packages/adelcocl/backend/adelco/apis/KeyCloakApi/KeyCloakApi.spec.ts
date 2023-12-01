import { getToken } from './KeyCloakApi';
import fetch from 'node-fetch';

jest.mock('node-fetch');

describe('getToken', () => {
  const mockResponse = { access_token: 'token' };

  beforeEach(() => {
    (fetch as jest.MockedFunction<any>).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });
  });

  it('should call fetch with correct values', async () => {
    await getToken({ email: 'foo@foo.com', password: 'foo' });

    expect(fetch).toHaveBeenCalledWith('https://qa-dia.adelco.cl/realms/DMI/protocol/openid-connect/token', {
      body: 'grant_type=password&client_id=my-client&username=foo%40foo.com&password=foo',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });
  });

  it('should return access token', async () => {
    const result = await getToken({
      email: 'test@test.com',
      password: 'password',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if authentication fails', async () => {
    (fetch as jest.MockedFunction<any>).mockResolvedValueOnce({
      json: jest.fn().mockRejectedValue(new Error('authentication failed')),
    });
    await expect(getToken({ email: 'test@test.com', password: 'incorrect-password' })).rejects.toThrow(
      'authentication failed',
    );
  });
});
