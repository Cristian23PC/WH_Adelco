import { ApiProperty } from '@nestjs/swagger';

export class CustomFieldsDto {
  @ApiProperty({ description: 'Reference to the Type that holds the FieldDefinitions for the Custom Fields.' })
  type: string;

  @ApiProperty({ description: 'Object containing the Custom Fields for the customized resource or data type.' })
  fields: string;
}
