import { mockLineItem, mockAdelcoCartResponse } from '@/carts/__mock__/carts.mock';
import { convertToAdelcoFormat } from '@adelco/price-calc';

export const mockAdelcoLineItem = convertToAdelcoFormat({ ...mockAdelcoCartResponse, lineItems: [mockLineItem] }).lineItems;
