import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.dto';

export class LogInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class DeleteAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class DaowakandaUserDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  user: UserResponseDto | null;
}

export class AuthTxnLoginDto {
  @ApiProperty()
  @IsString()
  authTxnBase64: string;

  @ApiProperty()
  @IsString()
  address: string;
}
