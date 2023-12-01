import fetch from 'node-fetch';

// Temporary, service should not ask for this
const userId = 'test.4@mail.com';

export const getCartById = async (baseURL: string, businessUnitId: string) => {
  const response = await fetch(`${baseURL}/business-unit/${businessUnitId}/carts/active`, {
    headers: {
      'x-user-id': userId,
      businessUnitId,
    },
  });
  return response.json();
};

export const setLineItemQuantity = async (
  baseURL: string,
  businessUnitId: string,
  itemId: string,
  quantity: number,
) => {
  const response = await fetch(
    `${baseURL}/business-unit/${businessUnitId}/carts/active/line-items/${itemId}/quantity`,
    {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
        businessUnitId,
        lineItemId: itemId,
        id: '1',
      },
    },
  );
  return response.json();
};

export const removeLineItem = async (baseURL: string, businessUnitId: string, itemId: string) => {
  const response = await fetch(`${baseURL}/business-unit/${businessUnitId}/carts/active/line-items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': userId,
      businessUnitId,
      lineItemId: itemId,
      id: '1',
    },
  });
  return response.json();
};

export const emptyCart = async (baseURL: string, businessUnitId: string, lineItemIds: string[]) => {
  // return Promise.all(lineItemIds.map((id) => removeLineItem(businessUnitId, id)));
  // lineItemIds.forEach(async (id) => {
  //   const response = await removeLineItem(businessUnitId, id);
  // });
};

export const addLineItem = async (baseURL: string, businessUnitId: string, sku: string, quantity: number) => {
  const response = await fetch(`${baseURL}/business-unit/${businessUnitId}/carts/active/line-items`, {
    method: 'POST',
    body: JSON.stringify({ sku, quantity }),
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      businessUnitId: businessUnitId,
    },
  });
  return response.json();
};
