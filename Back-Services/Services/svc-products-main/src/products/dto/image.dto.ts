import { ApiProperty } from '@nestjs/swagger';

export class DimensionsDto {
  @ApiProperty({ description: 'Width of the asset.' })
  w: number;
  @ApiProperty({ description: 'Height of the asset.' })
  h: number;
}

export class ImageDto {
  @ApiProperty({ description: 'URL of the image in its original size that must be unique within a single ProductVariant.' })
  url: string;

  @ApiProperty({ description: 'Dimensions of the original image.', type: DimensionsDto })
  dimensions: DimensionsDto;

  @ApiProperty({ description: 'Custom label for the image.', required: false })
  label: string;
}
