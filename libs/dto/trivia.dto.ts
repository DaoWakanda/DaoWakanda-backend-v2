import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { DIFFICULTY_LEVEL } from 'libs/enums/difficulty.enum';
import {
  DISBURSED_STATUS,
  REVIEW_STATUS,
  TRIVIA_STATUS,
} from 'libs/enums/status.enum';

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
  difficulty: DIFFICULTY_LEVEL;

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

  @ApiProperty({ description: 'Skill involved in the trivia' })
  @IsNotEmpty()
  @IsString()
  skill: string;
}

export class UpdateTriviaDto {
  @ApiPropertyOptional({ description: 'Title of the trivia' })
  title?: string;

  @ApiPropertyOptional({ description: 'Duration of the trivia in minutes' })
  duration?: number;

  @ApiPropertyOptional({
    description: 'Difficulty level of the trivia',
    enum: DIFFICULTY_LEVEL,
  })
  difficulty?: DIFFICULTY_LEVEL;

  @ApiPropertyOptional({ description: 'Prize amount for the trivia winner' })
  prize?: number;

  @ApiPropertyOptional({ description: 'Maximum number of winners allowed' })
  maxWinners?: number;

  @ApiPropertyOptional({ description: 'Description of the trivia' })
  description?: string;

  @ApiPropertyOptional({ description: 'Skill involved in the trivia' })
  skill?: string;
}

export class TriviaResponseDto {
  @ApiProperty({ description: 'Id of the trivia' })
  id: string;

  @ApiProperty({ description: 'Title of the trivia' })
  title: string;

  @ApiProperty({ description: 'Duration of the trivia in seconds' })
  duration: string;

  @ApiProperty({ description: 'TimeStamp of when the trivia ends' })
  endTimeStamp: number;

  @ApiProperty({
    description: 'Difficulty level of the trivia',
    enum: DIFFICULTY_LEVEL,
  })
  difficulty: DIFFICULTY_LEVEL;

  @ApiProperty({ description: 'Prize amount for the trivia winner' })
  prize: number;

  @ApiProperty({ description: 'Maximum number of winners allowed' })
  maxWinners: number;

  @ApiProperty({ description: 'Number of winners' })
  winnersCount: number;

  @ApiProperty({ description: 'Description of the trivia' })
  description: string;

  @ApiProperty({ description: 'Skill involved the trivia' })
  skill: string;

  @ApiProperty({ description: 'Date of the trivia creation' })
  createdAt: Date;

  @ApiProperty({
    description: 'Status of the trivia',
    enum: TRIVIA_STATUS,
  })
  status: TRIVIA_STATUS;
}

export class AnswerDto {
  @ApiProperty({ description: 'Github link submitted by the user' })
  @IsNotEmpty()
  @IsString()
  githubRepoLink: string;
}

export class ReviewStatusDto {
  @ApiProperty({ enum: REVIEW_STATUS, default: REVIEW_STATUS.REJECTED })
  @IsEnum(REVIEW_STATUS)
  status: REVIEW_STATUS = REVIEW_STATUS.REJECTED;
}

export class DisbursementStatusDto {
  @ApiProperty({
    enum: DISBURSED_STATUS,
    default: DISBURSED_STATUS.PENDING,
  })
  @IsEnum(DISBURSED_STATUS)
  status: DISBURSED_STATUS = DISBURSED_STATUS.PENDING;
}

export class LeaderboardResponseDto {
  @ApiProperty({ description: 'name of the winner' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'total algos of the winner' })
  @IsString()
  totalAlgos: number;
}

export class SubmissionResponseDto {
  @ApiProperty({ description: '' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'submission link' })
  @IsString()
  githubLink: string;

  @ApiProperty({ description: 'title of the trivia' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'submission status' })
  @IsString()
  submissionStatus: string;

  @ApiProperty({ description: 'disbursement status' })
  @IsString()
  disbursementStatus: string;

  @ApiProperty({ description: 'smart contract id' })
  smartContractId?: number;

  @ApiProperty({ description: 'bounty' })
  bounty?: number;
}
