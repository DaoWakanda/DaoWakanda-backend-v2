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

export class CreateProposalDtoV2 {
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

export class VoteProposalDtoV2 {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  vote: boolean;
}

export class ValidateAddressDto {
  @ApiProperty()
  address: string;
}

export class ValidateAddressVoteDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  appId: string;

  @ApiProperty()
  vote: boolean;
}

export class ValidateAddressVoteDtoV2 {
  @ApiProperty()
  appId: string;

  @ApiProperty()
  vote: boolean;
}

export class ValidateAddressResDto {
  @ApiProperty()
  valid: boolean;

  @ApiProperty()
  address: string;

  @ApiProperty()
  assetId: string;
}

export class CreateProposalGroupDto {
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsNotEmpty()
  appIds: string[];
}

export class EditProposalGroupDto {
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsNotEmpty()
  appIds: string[];
}

export class ProposalGroupDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: String, isArray: true })
  appIds: string[];
}

export class ProposalStatisticsDto {
  @ApiProperty({ description: 'Total number of proposals' })
  totalProposals: number;

  @ApiProperty({
    description: 'Number of active proposals (end date not exceeded)',
  })
  activeProposals: number;

  @ApiProperty({ description: 'Total number of votes across all proposals' })
  totalVotes: number;

  @ApiProperty({
    description:
      'Participation rate as percentage (unique voters / total users)',
  })
  participationRate: number;
}
