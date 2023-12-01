import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommonPaymentsDtoRequest {
  @ApiProperty({ required: true, description: 'Business Unit Id' })
  @IsNotEmpty()
  @IsString()
  businessUnitId: string;
}
