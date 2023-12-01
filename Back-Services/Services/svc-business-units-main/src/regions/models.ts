import { ApiProperty } from '@nestjs/swagger';

export class Region {
  constructor(key: string, label: string) {
    this.key = key;
    this.label = label;
  }

  @ApiProperty({ description: 'Region Key' })
  key: string;

  @ApiProperty({ description: 'Region label' })
  label: string;
}

export interface IRegionCustomObjectValue {
  label: string;
}
