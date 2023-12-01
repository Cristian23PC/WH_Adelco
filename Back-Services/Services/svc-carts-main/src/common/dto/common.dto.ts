import { ApiProperty } from '@nestjs/swagger';

export class CommonDto {
  @ApiProperty({ description: 'Date and time (UTC) when it was initially created.' })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time (UTC) when it was last updated.' })
  lastModifiedAt: Date;
}
