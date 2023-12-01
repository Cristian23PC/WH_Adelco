import { Address } from '@/business-units/dto/business-units.dto';

export interface PreRegistrationRequest {
  username: string;
  rut: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password: string;
}

export interface CompleteRegistrationRequest {
  username: string;
  code: string;
}

export interface RepRegistrationRequest {
  username?: string;
  rut: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tradeName?: string;
  address: Address;
  billingAddress?: Address;
  isFakeCustomer?: boolean;
}

export interface UserAndRutValidationRequest {
  username: string;
  rut: string;
}

export interface UserAndRutValidationResponse extends UserAndRutValidationRequest {
  buName: string;
}
