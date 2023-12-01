import { CtRegion, CtCommune, CtDeliveryZone } from '../types/businessUnit';
import fetch from 'node-fetch';

export const findRegions = async (baseURL: string): Promise<CtRegion[]> => {
  const response = await fetch(`${baseURL}/regions`);
  return response.json();
};

export const findCommunes = async (baseURL: string, regionKey: string): Promise<CtCommune[]> => {
  const response = await fetch(`${baseURL}/regions/${regionKey}/communes`);
  return response.json();
};

export const findDeliveryZones = async (
  baseURL: string,
  regionKey: string,
  communeKey: string,
): Promise<CtDeliveryZone> => {
  const response = await fetch(`${baseURL}/regions/${regionKey}/communes/${communeKey}/delivery-zones`);
  return response.json();
};
