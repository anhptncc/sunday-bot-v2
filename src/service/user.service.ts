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
    const { userId, dharmaName, ordinationDate } = user;
    const updateData: Partial<UpdateUserDto> = {};
    if (dharmaName !== undefined) {
      updateData.dharmaName = dharmaName;
    }
    if (ordinationDate !== undefined) {
      updateData.ordinationDate = ordinationDate;
    }
    return this.userRepo.update({ id: userId }, updateData);
  }
}
