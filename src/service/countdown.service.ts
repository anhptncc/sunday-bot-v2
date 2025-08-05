import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Countdown, CountdownType } from '../entities/countdown.entity';

@Injectable()
export class CountdownService {
  constructor(
    @InjectRepository(Countdown)
    private readonly countdownRepo: Repository<Countdown>,
  ) {}

  async getCountdownByType(type: CountdownType): Promise<Countdown | null> {
    const event = await this.countdownRepo.findOne({ where: { type } });
    return event;
  }
}
