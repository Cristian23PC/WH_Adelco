import { ApiProperty } from '@nestjs/swagger';

export class LocalizedStringDto<T extends string = string> {
  @ApiProperty({
    example: { 'es-CL': 'Hola' },
    description: 'Object containing localized string values',
    type: 'object',
    additionalProperties: { type: 'string' }
  })
  value: Record<T, string>;
}
