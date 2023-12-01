import fetch from 'node-fetch';

export const findCategories = async (baseURL: string, queryParams?: string) => {
  const response = await fetch(`${baseURL}/categories/${queryParams}`);
  return response.json();
};

export const getCategories = async (baseURL: string, queryParams: string) => {
  const response = await fetch(`${baseURL}/categories/tree${queryParams}`);
  return response.json();
};
