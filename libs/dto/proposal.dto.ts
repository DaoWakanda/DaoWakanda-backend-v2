import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddAssetToWhitelistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  assetId: string;
}

export class RemoveAssetFromWhitelistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  assetId: string;
}

export class AddAssetsToWhitelistDto {
  @ApiProperty()
  @IsArray({ each: true })
  @IsString({ each: true })
  assetIds: string[];
}

export class RemoveAssetsFromWhitelistDto {
  @ApiProperty()
  @IsArray({ each: true })
  @IsString({ each: true })
  assetIds: string[];
}

export class ProposalDto {
  @ApiProperty()
  appId: string;

  @ApiProperty()
  asaId?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: number;

  @ApiProperty()
  endDate: number;

  @ApiProperty()
  creator: string;

  @ApiProperty()
  ongoing: boolean;

  @ApiProperty({ isArray: true, type: String })
  registeredVoters: string[];

  @ApiProperty({ isArray: true, type: String })
  yesVotes: string[];

  @ApiProperty({ isArray: true, type: String })
  noVotes: string[];
}

export class CreateProposalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  appId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startDate: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  endDate: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  creator: string;
}

export class BootstrapProposalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  asaId: string;
}

export class VoteProposalDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  vote: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  voterAddress: string;
}

export class ValidateAddressDto {
  @ApiProperty()
  address: string;
}

export class ValidateAddressResDto {
  @ApiProperty()
  valid: boolean;

  @ApiProperty()
  address: string;

  @ApiProperty()
  assetId: string;
}
