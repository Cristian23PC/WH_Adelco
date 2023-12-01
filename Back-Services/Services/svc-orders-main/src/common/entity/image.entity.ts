import { ApiProperty } from '@nestjs/swagger';

export class DimensionsEntity {
  @ApiProperty({ description: 'Width of the asset.' })
  w: number;
  @ApiProperty({ description: 'Height of the asset.' })
  h: number;
}

export class ImageEntity {
  @ApiProperty({ description: 'URL of the image in its original size that must be unique within a single ProductVariant.' })
  url: string;

  @ApiProperty({ description: 'Dimensions of the original image.', type: DimensionsEntity })
  dimensions: DimensionsEntity;

  @ApiProperty({ description: 'Custom label for the image.', required: false })
  label: string;
}
