import { ApiProperty } from '@nestjs/swagger';

export class AttributeEntity {
  @ApiProperty({ description: 'Name of the Attribute.' })
  name: string;

  @ApiProperty({
    description:
      'The AttributeType determines the format of the Attribute value to be provided: \n * For Enum Type and Localized Enum Type, use the key of the Plain Enum Value or Localized Enum Value objects, or the complete objects as value. \n * For Localizable Text Type, use the LocalizedString object as value. \n * For Money Type Attributes, use the Money object as value. \n * For Set Type Attributes, use the entire set object as value. \n * For Nested Type Attributes, use the list of values of all Attributes of the nested Product as value. \n * For Reference Type Attributes, use the Reference object as value.'
  })
  value: any;
}
