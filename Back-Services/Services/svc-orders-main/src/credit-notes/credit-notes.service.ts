import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { InjectRepository } from '@/nest-commercetools';
import { CustomObject, CustomObjectDraft } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';

@Injectable()
export class CreditNotesService {
  private container = 'credit-notes';

  constructor(
    @InjectRepository(CustomObjectsRepository)
    private readonly customObjectsRepository: CustomObjectsRepository
  ) {}

  async getByCreditNotesKeys(keys: string[]): Promise<CustomObject[]> {
    const { results } = await this.customObjectsRepository.find({
      queryArgs: { where: [`value(dteNumber in ("${keys.join('","')}"))`, `container="${this.container}"`] }
    });

    if (results.length !== keys.length) {
      const missingCreditNotes = keys.filter(key => !results.some(creditNote => key === creditNote.value?.dteNumber));
      throw ErrorBuilder.buildError('creditNotesNotFound', JSON.stringify(missingCreditNotes));
    }

    return results;
  }

  async update(creditNote: CustomObjectDraft): Promise<CustomObject> {
    return this.customObjectsRepository.create({ body: creditNote });
  }
}
