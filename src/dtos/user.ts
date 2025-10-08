export interface CreateOrUpdateUserDto {
  userId: string;
  balance: number;
  username: string;
}

export interface CreateUserDto {
  userId: string;
  username: string;
}

export interface UpdateUserDto {
  userId: string;
  dharmaName?: string;
  ordinationDate?: Date;
  balance?: number;
}
