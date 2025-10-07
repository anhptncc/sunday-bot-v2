import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTransaction } from '../entities/user-transaction.entity';

@Injectable()
export class UserTransactionService {
  constructor(
    @InjectRepository(UserTransaction)
    private userTransactionRepository: Repository<UserTransaction>,
  ) {}

  async createTransaction(
    senderId: string,
    receiverId: string,
    amount: number,
  ): Promise<UserTransaction> {
    const transaction = this.userTransactionRepository.create({
      senderId,
      receiverId,
      amount,
    });
    return this.userTransactionRepository.save(transaction);
  }

  async getUserTransactions(userId: string): Promise<UserTransaction[]> {
    return this.userTransactionRepository.find({ where: { senderId: userId } });
  }
}
