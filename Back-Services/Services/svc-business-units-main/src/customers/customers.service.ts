import { InjectRepository } from '@/nest-commercetools';
import { CustomerDraft, CustomerSignInResult, Customer } from '@commercetools/platform-sdk';
import { NotFoundException } from '@nestjs/common';
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
      queryArgs: { where: [`lowercaseEmail = "${email.toLowerCase()}"`], limit: 1 }
    });

    if (response.results.length === 0) {
      throw new NotFoundException('Customer not found');
    }

    return response.results[0];
  }

  async createCustomer(customerDraft: CustomerDraft): Promise<CustomerSignInResult> {
    return await this.customersRepository.create({ body: customerDraft });
  }

  async deleteById(id: string, version: number): Promise<Customer> {
    return await this.customersRepository.deleteById(id, { queryArgs: { version } });
  }
}
