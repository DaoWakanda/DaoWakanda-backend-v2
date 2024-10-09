import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { DIFFICULTY_LEVEL } from 'libs/enums/difficulty.enum';

export class CreateTriviaDto {
  @ApiProperty({ description: 'Title of the trivia' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Duration of the trivia in seconds' })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'Difficulty level of the trivia',
    enum: DIFFICULTY_LEVEL,
  })
  @IsNotEmpty()
  @IsEnum({ enum: DIFFICULTY_LEVEL })
  difficultyLvl: DIFFICULTY_LEVEL;

  @ApiProperty({ description: 'Prize amount for the trivia winner' })
  @IsNotEmpty()
  @IsNumber()
  prize: number;

  @ApiProperty({ description: 'Maximum number of winners' })
  @IsNotEmpty()
  @IsNumber()
  maxWinners: number;

  @ApiProperty({ description: 'Description of the trivia' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateTriviaDto extends PartialType(CreateTriviaDto) {
  @ApiPropertyOptional({ description: 'Title of the trivia' })
  title?: string;

  @ApiPropertyOptional({ description: 'Duration of the trivia in minutes' })
  duration?: number;

  @ApiPropertyOptional({
    description: 'Difficulty level of the trivia',
    enum: DIFFICULTY_LEVEL,
  })
  difficultyLvl?: DIFFICULTY_LEVEL;

  @ApiPropertyOptional({ description: 'Prize amount for the trivia winner' })
  prize?: number;

  @ApiPropertyOptional({ description: 'Maximum number of winners' })
  maxWinners?: number;

  @ApiPropertyOptional({ description: 'Description of the trivia' })
  description?: string;
}

export class TriviaResponseDto {
  @ApiProperty({ description: 'Id of the trivia' })
  id: string;

  @ApiProperty({ description: 'Title of the trivia' })
  title: string;

  @ApiProperty({ description: 'Duration of the trivia in seconds' })
  duration: string;

  @ApiProperty({
    description: 'Difficulty level of the trivia',
    enum: DIFFICULTY_LEVEL,
  })
  difficultyLvl: DIFFICULTY_LEVEL;

  @ApiProperty({ description: 'Prize amount for the trivia winner' })
  prize: number;

  @ApiProperty({ description: 'Maximum number of winners' })
  maxWinners: number;

  @ApiProperty({ description: 'Description of the trivia' })
  description: string;

  @ApiProperty({ description: 'Date of the trivia creation' })
  date: string;
}
