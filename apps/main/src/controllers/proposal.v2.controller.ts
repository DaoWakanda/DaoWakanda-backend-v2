import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BootstrapProposalDto,
  CreateProposalDtoV2,
  ProposalDto,
  ValidateAddressResDto,
  ValidateAddressVoteDtoV2,
  VoteProposalDtoV2,
} from 'libs/dto';
import { JwtAuthGuard } from 'libs/guards/jwt/jwt-auth.guard';
import { ProposalService } from 'modules/proposal/proposal.service';

@ApiTags('Proposals Manager v2')
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
@Controller('v2/proposal')
export class ProposalControllerV2 {
  constructor(private readonly proposalService: ProposalService) {}

  @ApiOperation({ summary: 'Create a proposal' })
  @ApiBody({ type: CreateProposalDtoV2 })
  @ApiResponse({ type: ProposalDto })
  @Post('')
  createProposal(@Body() dto: CreateProposalDtoV2, @Request() req: any) {
    const creator = req.user.walletAddress;
    return this.proposalService.createProposal({ ...dto, creator });
  }

  @ApiOperation({ summary: 'Bootstrap a proposal' })
  @ApiBody({ type: BootstrapProposalDto })
  @ApiResponse({ type: ProposalDto })
  @Post(':appId/bootstrap')
  bootstrapProposal(
    @Body() dto: BootstrapProposalDto,
    @Param('appId') appId: string,
  ) {
    return this.proposalService.bootstrapProposal(appId, dto);
  }

  @ApiOperation({ summary: 'Vote for a proposal' })
  @ApiBody({ type: VoteProposalDtoV2 })
  @ApiResponse({ type: ProposalDto })
  @Post(':appId/vote')
  voteForProposal(
    @Body() dto: VoteProposalDtoV2,
    @Param('appId') appId: string,
    @Request() req: any,
  ) {
    return this.proposalService.voteForProposal(appId, {
      ...dto,
      voterAddress: req.user.walletAddress,
    });
  }

  @ApiOperation({ summary: 'Validate wallet address' })
  @ApiResponse({ type: ValidateAddressResDto })
  @Post('validate-address')
  validateAddress(@Request() req: any) {
    return this.proposalService.validateAddress(req.user.walletAddress);
  }

  @ApiOperation({ summary: 'Validate wallet address vote dto' })
  @ApiBody({ type: ValidateAddressVoteDtoV2 })
  @ApiResponse({ type: ValidateAddressResDto })
  @Post('validate-address-vote')
  validateAddressVote(
    @Body() dto: ValidateAddressVoteDtoV2,
    @Request() req: any,
  ) {
    return this.proposalService.validateProposalVote(
      req.user.walletAddress,
      dto.appId,
      dto.vote,
    );
  }
}
