import { ApiProperty } from '@nestjs/swagger';

export class ProductSuggestionDto {
  @ApiProperty({ description: 'The suggested text.' })
  text: string;
}
