import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Order } from 'libs/enums/order.enum';
import { TriviaResponseDto } from './trivia.dto';

export class PageOptionsDto {
  @ApiProperty({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order = Order.ASC;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly orderBy?: string;

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

export class PaginationResponseDto {
  @ApiProperty({ type: [TriviaResponseDto] })
  @Type(() => TriviaResponseDto)
  @IsArray()
  data: TriviaResponseDto[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly pagination: PageMetaDto;
}
