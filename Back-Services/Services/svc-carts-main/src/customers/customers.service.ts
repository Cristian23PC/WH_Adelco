import { InjectRepository } from '@/nest-commercetools/decorators/nest-commercetools.decorators';
import { Customer } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { CustomersRepository } from 'commercetools-sdk-repositories';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersRepository)
    private readonly customersRepository: CustomersRepository
  ) {}

  async getCustomerByEmail(email: string): Promise<Customer> {
    const response = await this.customersRepository.find({
      queryArgs: { where: [`email = "${email}"`] }
    });

    return response.results[0];
  }
}
