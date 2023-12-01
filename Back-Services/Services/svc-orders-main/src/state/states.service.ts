import { InjectRepository } from '@/nest-commercetools';
import { State } from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { StatesRepository } from 'commercetools-sdk-repositories';
import { KeyState } from './states.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(StatesRepository)
    private readonly statesRepository: StatesRepository,
    @Inject(CACHE_MANAGER)
    protected readonly cacheManager: Cache,
    private configService: ConfigService
  ) {}

  async getByKey(key: KeyState): Promise<State> {
    let state: State = await this.cacheManager.get(this.getCacheKey(key));

    if (!state) {
      state = await this.statesRepository.getByKey(key);
      await this.cacheManager.set(this.getCacheKey(key), state, this.configService.get<number>('state.orderStateCacheTTL'));
    }

    return state;
  }

  private getCacheKey(key: KeyState): string {
    return `STATE_${key}`;
  }
}
