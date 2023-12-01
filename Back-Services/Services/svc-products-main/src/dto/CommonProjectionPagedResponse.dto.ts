import { ApiProperty } from '@nestjs/swagger';

export class CommonProjectionPagedResponseDto {
  @ApiProperty({ description: 'Number of results requested.', example: 1 })
  limit: number;

  @ApiProperty({ description: 'Actual number of results returned.', example: 1 })
  count: number;

  @ApiProperty({ description: 'Total number of results matching the query.', required: false, example: 20 })
  total: number;

  @ApiProperty({ description: 'Number of elements skipped.', example: 1 })
  offset: number;
}
