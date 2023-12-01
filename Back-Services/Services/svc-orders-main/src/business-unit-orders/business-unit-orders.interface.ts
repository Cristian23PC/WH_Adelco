import { ConvertActiveCartRequestDto } from './dto/business-unit-orders.dto';

export interface IConvertActiveCartProps {
  businessUnitId: string;
  body: ConvertActiveCartRequestDto;
  username: string;
  roles: string[];
  cartId?: string;
}
