import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AddAssetToWhitelistDto,
  AddAssetsToWhitelistDto,
  BootstrapProposalDto,
  CreateProposalDto,
  ProposalDto,
  RemoveAssetFromWhitelistDto,
  RemoveAssetsFromWhitelistDto,
  ValidateAddressDto,
  ValidateAddressResDto,
  VoteProposalDto,
} from 'libs/dto';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { ProposalService } from 'modules/proposal/proposal.service';

@ApiTags('Proposals Manager')
@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @ApiOperation({ summary: 'Get Whitelisted ASA ID' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({ type: Array<String> })
  @UseGuards(AdminJwtAuthGuard)
  @Get('asset-whitelist')
  getWhitelistedAssets() {
    return this.proposalService.getAllWhitelist();
  }

  @ApiOperation({ summary: 'Whitelist ASA ID' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: AddAssetToWhitelistDto })
  @UseGuards(AdminJwtAuthGuard)
  @Post('asset-whitelist')
  whitelistAsset(@Body() dto: AddAssetToWhitelistDto) {
    return this.proposalService.addAssetToWhitelist(dto.assetId);
  }

  @ApiOperation({ summary: 'Remove ASA ID from Whitelist' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: RemoveAssetFromWhitelistDto })
  @UseGuards(AdminJwtAuthGuard)
  @Delete('asset-whitelist')
  removeAssetFromWhitelist(@Body() dto: RemoveAssetFromWhitelistDto) {
    return this.proposalService.removeAssetFromWhitelist(dto.assetId);
  }

  @ApiOperation({ summary: 'Whitelist batch of ASA IDs' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: AddAssetsToWhitelistDto })
  @UseGuards(AdminJwtAuthGuard)
  @Post('asset-whitelist/many')
  whitelistAssets(@Body() dto: AddAssetsToWhitelistDto) {
    return this.proposalService.batchUploadAssetsToWhiteList(dto.assetIds);
  }

  @ApiOperation({ summary: 'Batch delete Whitelisted ASA IDs' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: RemoveAssetsFromWhitelistDto })
  @UseGuards(AdminJwtAuthGuard)
  @Delete('asset-whitelist/many')
  removeWhitelistedAssets(@Body() dto: RemoveAssetsFromWhitelistDto) {
    return this.proposalService.batchDeleteAssetsFromWhiteList(dto.assetIds);
  }

  @ApiOperation({ summary: 'Get all proposals' })
  @ApiResponse({ type: ProposalDto, isArray: true })
  @Get('all')
  getAllProposal() {
    return this.proposalService.getAllProposals();
  }

  @ApiOperation({ summary: 'Get proposal by App ID' })
  @ApiResponse({ type: ProposalDto })
  @Get(':appId')
  getProposalByAppId(@Param('appId') appId: string) {
    return this.proposalService.getProposalByAppId(appId);
  }

  @ApiOperation({ summary: 'Create a proposal' })
  @ApiBody({ type: CreateProposalDto })
  @ApiResponse({ type: ProposalDto })
  @Post('')
  createProposal(@Body() dto: CreateProposalDto) {
    return this.proposalService.createProposal(dto);
  }

  @ApiOperation({ summary: 'Bootstrap a proposal' })
  @ApiBody({ type: BootstrapProposalDto })
  @ApiResponse({ type: ProposalDto })
  @Post(':appId/bootstrap')
  bootstrapProposal(
    @Body() dto: BootstrapProposalDto,
    @Param('appId') appId: string
  ) {
    return this.proposalService.bootstrapProposal(appId, dto);
  }

  @ApiOperation({ summary: 'Vote for a proposal' })
  @ApiBody({ type: VoteProposalDto })
  @ApiResponse({ type: ProposalDto })
  @Post(':appId/vote')
  voteForProposal(@Body() dto: VoteProposalDto, @Param('appId') appId: string) {
    return this.proposalService.voteForProposal(appId, dto);
  }

  @ApiOperation({ summary: 'Delete a proposal' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({ type: ProposalDto, isArray: true })
  @UseGuards(AdminJwtAuthGuard)
  @Delete(':appId')
  deleteProposal(@Param('appId') appId: string) {
    return this.proposalService.deleteProposal(appId);
  }

  @ApiOperation({ summary: 'Validate wallet address' })
  @ApiBody({ type: ValidateAddressDto })
  @ApiResponse({ type: ValidateAddressResDto })
  @Post('validate-address')
  validateAddress(@Body() dto: ValidateAddressDto) {
    return this.proposalService.validateAddress(dto.address);
  }
}
