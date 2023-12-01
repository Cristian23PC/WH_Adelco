import { CustomFields } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { CustomFieldsEntity } from '../custom-fields.entity';

export class AddressEntity {
  @ApiProperty({
    description: 'Unique identifier of the Address.',
    type: String,
    required: false
  })
  id?: string;

  @ApiProperty({
    description: 'User-defined identifier of the Address.',
    type: String,
    required: false
  })
  key?: string;

  @ApiProperty({
    description: 'Name of the country.',
    type: String,
    required: true
  })
  country: string;

  @ApiProperty({
    description: 'Title of the contact, for example `Dr.`',
    type: String,
    required: false
  })
  title?: string;

  @ApiProperty({
    description: 'Salutation of the contact, for example `Mr.` or `Ms.`',
    type: String,
    required: false
  })
  salutation?: string;

  @ApiProperty({
    description: 'Given name (first name) of the contact.',
    type: String,
    required: false
  })
  firstName?: string;

  @ApiProperty({
    description: 'Family name (last name) of the contact.',
    type: String,
    required: false
  })
  lastName?: string;

  @ApiProperty({
    description: 'Name of the street.',
    type: String,
    required: false
  })
  streetName?: string;

  @ApiProperty({
    description: 'Street number.',
    type: String,
    required: false
  })
  streetNumber?: string;

  @ApiProperty({
    description: 'Further information on the street address.',
    type: String,
    required: false
  })
  additionalStreetInfo?: string;

  @ApiProperty({
    description: 'Postal code.',
    type: String,
    required: false
  })
  postalCode?: string;

  @ApiProperty({
    description: 'Name of the city.',
    type: String,
    required: false
  })
  city?: string;

  @ApiProperty({
    description: 'Name of the region.',
    type: String,
    required: false
  })
  region?: string;

  @ApiProperty({
    description: 'Name of the state, for example, Colorado.',
    type: String,
    required: false
  })
  state?: string;

  @ApiProperty({
    description: 'Name of the company.',
    type: String,
    required: false
  })
  company?: string;

  @ApiProperty({
    description: 'Name of the department.',
    type: String,
    required: false
  })
  department?: string;

  @ApiProperty({
    description: 'Number or name of the building.',
    type: String,
    required: false
  })
  building?: string;

  @ApiProperty({
    description: 'Number or name of the apartment.',
    type: String,
    required: false
  })
  apartment?: string;

  @ApiProperty({
    description: 'Post office box number.',
    type: String,
    required: false
  })
  pOBox?: string;

  @ApiProperty({
    description: 'Phone number of the contact.',
    type: String,
    required: false
  })
  phone?: string;

  @ApiProperty({
    description: 'Mobile phone number of the contact.',
    type: String,
    required: false
  })
  mobile?: string;

  @ApiProperty({
    description: 'Email address of the contact.',
    type: String,
    required: false
  })
  email?: string;

  @ApiProperty({
    description: 'Fax number of the contact.',
    type: String,
    required: false
  })
  fax?: string;

  @ApiProperty({
    description: 'Further information on the Address.',
    type: String,
    required: false
  })
  additionalAddressInfo?: string;

  @ApiProperty({
    description: 'ID for the contact used in an external system.',
    type: String,
    required: false
  })
  externalId?: string;

  @ApiProperty({
    description: 'Custom Fields defined for the Address.',
    type: () => CustomFieldsEntity,
    required: true
  })
  custom?: CustomFields;
}
