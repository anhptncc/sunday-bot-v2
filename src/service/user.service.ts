import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '@app/entities/user.entity';
import {
  CreateOrUpdateUserDto,
  CreateUserDto,
  UpdateUserDto,
} from '@app/dtos/user';

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

  async findUserOrCreate({ userId, username }: CreateUserDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      const newUser = this.userRepo.create({ id: userId, username });
      return this.userRepo.save(newUser);
    }

    return user;
  }

  async validateAdmin(userId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const isAdmin = user && user.role === UserRole.ADMIN;
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
  }

  async updateUser(user: UpdateUserDto) {
    const { userId, ...rest } = user;
    const updateData = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    );
    return this.userRepo.update({ id: userId }, updateData);
  }

  async updateBotBalance(amount: number) {
    const sunday = await this.userRepo.findOneBy({ role: UserRole.BOT });
    if (sunday) {
      return this.userRepo.increment({ role: UserRole.BOT }, 'balance', amount);
    }
  }

  async getBotBalance(): Promise<number> {
    const bot = await this.userRepo.findOneBy({ role: UserRole.BOT });
    return bot?.balance || 0;
  }

  async getUserBalance(userId: string): Promise<number> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['balance'],
    });
    return user?.balance || 0;
  }
}
