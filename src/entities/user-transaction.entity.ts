import { AbstractEntity } from '@app/common/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('user_transactions')
export class UserTransaction extends AbstractEntity {
  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column({ type: 'numeric' })
  amount: number;
}
