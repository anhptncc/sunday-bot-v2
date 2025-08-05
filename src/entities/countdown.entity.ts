import { AbstractEntity } from '@app/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

export enum CountdownType {
  PAYDAY = 'payday',
  LUNAR_NEW_YEAR = 'lunar_new_year',
  NEW_YEAR = 'new_year',
  CHRISTMAS = 'christmas',
}

@Entity({
  name: 'countdown',
})
export class Countdown extends AbstractEntity {
  @Column({
    type: 'varchar',
  })
  type: CountdownType;

  @Column({ type: 'date' })
  targetDate: Date;

  @Column({
    default: false,
    type: 'boolean',
  })
  isFinished: boolean;
}
