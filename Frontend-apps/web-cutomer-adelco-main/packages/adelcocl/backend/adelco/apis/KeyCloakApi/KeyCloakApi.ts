import fetch from 'node-fetch';
import { EmailPassword } from '@Types/adelco/user';
import { URLSearchParams } from 'url';
import { KEY_CLOAK_URL } from '../../config';

export const getToken = async ({ email, password }: EmailPassword) => {
  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: 'my-client',
    username: email,
    password,
  });

  const response = await fetch(`${KEY_CLOAK_URL}/token`, {
    method: 'POST',
    body: params.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.json();
};
