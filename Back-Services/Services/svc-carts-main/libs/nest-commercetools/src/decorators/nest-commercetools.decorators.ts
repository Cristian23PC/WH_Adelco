import { Inject } from '@nestjs/common';
import { IRepository } from '../interfaces/nest-commercetools-options.interface';

export const InjectRepository = (repository: IRepository) => Inject(repository);
