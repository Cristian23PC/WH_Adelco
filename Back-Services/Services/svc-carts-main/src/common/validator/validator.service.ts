import { BadRequestException, Injectable } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ValidatorService {
  validate<T>(classReference: ClassConstructor<T>, data: object): void {
    const instance = plainToInstance(classReference, data);
    const errors = validateSync(instance as object);

    if (errors.length > 0) {
      throw new BadRequestException('Data structure validation does not pass');
    }
  }
}
