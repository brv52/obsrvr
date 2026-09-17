import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';
import { User } from 'lib/types/userType';

export class UpdateUserDto implements Partial<User> {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin';
}
