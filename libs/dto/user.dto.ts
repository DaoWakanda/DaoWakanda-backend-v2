import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  stateOfResidence: string;

  @ApiProperty()
  @IsString()
  githubLink: string;

  @ApiProperty()
  @IsNotEmpty()
  walletAddress: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  stateOfResidence?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  githubLink?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'Unique identifier of the user' })
  @IsOptional()
  id: string;

  @ApiProperty({ description: 'First name of the user' })
  @IsOptional()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsOptional()
  lastName: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Profile image URL of the user',
    required: false,
  })
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Country of the user' })
  @IsOptional()
  country: string;

  @ApiProperty({ description: 'State of residence of the user' })
  @IsOptional()
  stateOfResidence: string;

  @ApiProperty({
    description: 'GitHub profile link of the user',
    required: false,
  })
  @IsOptional()
  githubLink?: string;

  @ApiProperty({ description: 'Wallet address of the user' })
  @IsOptional()
  walletAddress: string;

  @ApiProperty({ description: 'Number of awarded algorithms to the user' })
  @IsOptional()
  awardedAlgos: number;
}
