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

  async updatePaydayCountdown(
    payload: Pick<Countdown, 'targetDate' | 'isFinished'>,
  ): Promise<Countdown> {
    const paydayEvent = await this.getCountdownByType(CountdownType.PAYDAY);

    if (!paydayEvent) {
      throw new Error('Payday event not found');
    }

    const { targetDate, isFinished } = payload;

    if (targetDate !== undefined) paydayEvent.targetDate = payload.targetDate;
    if (isFinished !== undefined) paydayEvent.isFinished = payload.isFinished;

    return this.countdownRepo.save(paydayEvent);
  }
}
