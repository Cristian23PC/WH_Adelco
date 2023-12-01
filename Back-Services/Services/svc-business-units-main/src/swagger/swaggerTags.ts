import { EnumSwaggerTags } from './enum';
import { ISwaggerTags } from './swagger.interfaces';

export const swaggerTags: ISwaggerTags[] = [
  {
    name: EnumSwaggerTags.BUSINESS_UNIT,
    description: "API's for Business Unit"
  },
  {
    name: EnumSwaggerTags.REGIONS_COMMUNES_DELIVERY_ZONES,
    description: "API's for regions, communes and delivery zones"
  },
  {
    name: EnumSwaggerTags.BEST_DELIVERY_ZONE,
    description: "API's to get the best delivery zone"
  },
  {
    name: EnumSwaggerTags.BUSINESS_UNIT_USERS,
    description: "API's to communicate with Bussines Unit of the user"
  },
  {
    name: EnumSwaggerTags.BUSINESS_UNIT_CUSTOMER,
    description: "API's to communicate with Bussines Unit of the customer (deprecated should use users)"
  }
];
