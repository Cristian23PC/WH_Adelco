import { ApiProperty } from '@nestjs/swagger';

export class Commune {
  constructor(key: string, label: string, region: string) {
    this.key = key;
    this.label = label;
    this.region = region;
  }

  @ApiProperty({ description: 'Commune Key' })
  key: string;

  @ApiProperty({ description: 'Commune label' })
  label: string;

  @ApiProperty({ description: 'Commune region' })
  region: string;
}

export interface ICommuneCustomObjectValue {
  label: string;
  region: string;
}
