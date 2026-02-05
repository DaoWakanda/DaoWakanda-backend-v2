import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsNumber,
  IsString,
} from 'class-validator';
import { DIFFICULTY_LEVEL } from 'libs/enums/difficulty.enum';
import { Order } from 'libs/enums/order.enum';
import {
  PROPOSAL_STATUS,
  SUBMISSION_STATUS,
  TRIVIA_STATUS,
} from 'libs/enums/status.enum';

export class BasePageOptionsDto {
  @ApiProperty({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNumber()
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNumber()
  @Max(50)
  @IsOptional()
  readonly numOfItemsPerPage: number = 10;

  get skip(): number {
    return (+this.page - 1) * +this.numOfItemsPerPage;
  }
}
export class PageOptionsDto extends BasePageOptionsDto {
  @ApiPropertyOptional({
    enum: DIFFICULTY_LEVEL,
  })
  @IsEnum(DIFFICULTY_LEVEL)
  @IsOptional()
  readonly difficulty?: DIFFICULTY_LEVEL;

  @ApiPropertyOptional({
    enum: TRIVIA_STATUS,
  })
  @IsEnum(TRIVIA_STATUS)
  @IsOptional()
  readonly status?: TRIVIA_STATUS;

  @ApiPropertyOptional({})
  @IsString()
  @IsOptional()
  readonly searchTerm?: string;
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly numOfItemsPerPage: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: { pageOptionsDto; itemCount }) {
    this.page = pageOptionsDto.page;
    this.numOfItemsPerPage = pageOptionsDto.numOfItemsPerPage;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.numOfItemsPerPage);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

// export class PaginationResponseDto {
//   @ApiProperty({ type: [TriviaResponseDto] })
//   @Type(() => TriviaResponseDto)
//   @IsArray()
//   data: TriviaResponseDto[];

//   @ApiProperty({ type: () => PageMetaDto })
//   readonly pagination: PageMetaDto;
// }

export class PaginationResponseDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly pagination: PageMetaDto;
}

export class SubmissionPageOptionsDto extends BasePageOptionsDto {
  @ApiPropertyOptional({
    enum: SUBMISSION_STATUS,
  })
  @IsEnum(SUBMISSION_STATUS)
  @IsOptional()
  readonly filterBy?: SUBMISSION_STATUS;
}

export class ProposalPageOptionsDto extends BasePageOptionsDto {
  @ApiPropertyOptional({
    enum: PROPOSAL_STATUS,
  })
  @IsEnum(PROPOSAL_STATUS)
  @IsOptional()
  readonly status?: PROPOSAL_STATUS;
}
