export interface FormValues {
  useBusinessAddress?: boolean;
  region: string;
  commune: string;
  locality?: string;
  street: string;
  streetNumber?: string;
  noStreetNumber?: boolean;
  apartment?: string;
  additionalInformation?: string;
}
