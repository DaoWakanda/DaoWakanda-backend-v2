import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  CreateProposalGroupDto,
  EditProposalGroupDto,
  ProposalGroupDto,
} from 'libs/dto';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { ProposalService } from 'modules/proposal/proposal.service';

@ApiTags('Admin Proposals Manager')
@Controller('admin-proposal')
export class AdminProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @ApiOperation({ summary: 'Get all proposal groups' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({ type: ProposalGroupDto, isArray: true })
  @UseGuards(AdminJwtAuthGuard)
  @Get('proposal-group')
  getAllProposalGroups() {
    return this.proposalService.getAllProposalGroups();
  }

  @ApiOperation({ summary: 'Create proposal group' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: CreateProposalGroupDto })
  @UseGuards(AdminJwtAuthGuard)
  @Post('proposal-group')
  createProposalGroup(@Body() dto: CreateProposalGroupDto) {
    return this.proposalService.createProposalGroup(dto);
  }

  @ApiOperation({ summary: 'Replace proposal group' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: EditProposalGroupDto })
  @UseGuards(AdminJwtAuthGuard)
  @Put('proposal-group/:id')
  replaceProposalGroup(
    @Body() dto: EditProposalGroupDto,
    @Param('id') id: string,
  ) {
    return this.proposalService.replaceProposalGroup(id, dto);
  }

  @ApiOperation({ summary: 'Delete proposal group' })
  @ApiBearerAuth('Bearer')
  @UseGuards(AdminJwtAuthGuard)
  @Delete('proposal-group/:id')
  deleteProposalGroup(@Param('id') id: string) {
    return this.proposalService.deleteProposalGroup(id);
  }
}
