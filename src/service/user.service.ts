import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/entities/user.entity';
import { CreateOrUpdateUserDto } from '@app/dtos/CreateOrUpdateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createOrUpdateUser({
    userId,
    balance,
    username,
  }: CreateOrUpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (user) {
      user.balance += balance;
      return this.userRepo.save(user);
    }

    const newUser = this.userRepo.create({ id: userId, balance, username });
    return this.userRepo.save(newUser);
  }
}
