import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PageOptionsDto, PaginationResponseDto } from 'libs/dto/page.dto';
import {
  CreateTriviaDto,
  DisbursementStatusDto,
  ReviewStatusDto,
  SubmissionResponseDto,
  TriviaResponseDto,
  UpdateTriviaDto,
} from 'libs/dto/trivia.dto';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { TriviaService } from 'modules/trivia/trivia.service';

@ApiTags('Admin Challenge Manager')
@Controller('trivia')
@UseInterceptors(ClassSerializerInterceptor)
export class TriviaController {
  constructor(private readonly triviaService: TriviaService) {}

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create Trivia details' })
  @Post('create')
  @ApiResponse({ status: 201, description: 'Trivia created successfully.' })
  @ApiResponse({
    status: 409,
    description: 'Trivia with that title already exists.',
    type: TriviaResponseDto,
  })
  @UseGuards(AdminJwtAuthGuard)
  @ApiBody({ type: CreateTriviaDto })
  async createTrivia(@Body() triviaDto: CreateTriviaDto) {
    return this.triviaService.createTrivia(triviaDto);
  }

  @ApiOperation({ summary: 'List all trivias' })
  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'List of all trivias.',
    type: [PaginationResponseDto],
  })
  async getAllTrivias(@Query() options: PageOptionsDto) {
    return this.triviaService.getAllTrivias(options);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get current Trivia details' })
  @Get(':id/detail')
  @ApiResponse({
    status: 200,
    description: 'Trivia found.',
    type: TriviaResponseDto,
  })
  @UseGuards(AdminJwtAuthGuard)
  @ApiResponse({ status: 404, description: 'Trivia not found.' })
  async getTriviaById(@Param('id') id: string) {
    return this.triviaService.getTriviaById(id);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update current Trivia details' })
  @Patch(':id/update')
  @ApiResponse({ status: 200, description: 'Trivia updated successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Trivia not found or unable to update.',
    type: TriviaResponseDto,
  })
  @UseGuards(AdminJwtAuthGuard)
  @ApiBody({ type: UpdateTriviaDto })
  async updateTrivia(
    @Param('id') id: string,
    @Body() triviaDto: UpdateTriviaDto,
  ) {
    return this.triviaService.updateTrivia(id, triviaDto);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get list of all submissions by trivia' })
  @ApiResponse({
    status: 200,
    description: 'List of all submissions by trivia.',
    type: [SubmissionResponseDto],
  })
  @UseGuards(AdminJwtAuthGuard)
  @Get('submissions-by-trivia/:id')
  async getSubmissionsByTrivia(@Param('id') id: string) {
    return this.triviaService.getSubmissionsByTrivia(id);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete current Trivia' })
  @Delete(':id/delete')
  @UseGuards(AdminJwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Trivia deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Trivia not found.' })
  async deleteTrivia(@Param('id') id: string) {
    return this.triviaService.deleteTrivia(id);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get list of all submissions' })
  @ApiResponse({
    status: 200,
    description: 'List of all submissions.',
    type: [PaginationResponseDto],
  })
  @UseGuards(AdminJwtAuthGuard)
  @Get('all-submissions')
  async getSubmissions(@Query() options: PageOptionsDto) {
    return this.triviaService.getAllSubmissions(options);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Approve submission' })
  @ApiResponse({ status: 200, description: 'Submission approved.' })
  @UseGuards(AdminJwtAuthGuard)
  @Get('approve/:submissionId')
  async approveSubmission(
    @Param('submissionId') submissionId: string,
    @Query() review: ReviewStatusDto,
  ) {
    return this.triviaService.approveAnswer(submissionId, review.status);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Disburse algos for submission' })
  @ApiResponse({ status: 200, description: 'Algos disbursed successfully.' })
  @ApiResponse({ status: 404, description: 'Submission not found.' })
  @ApiResponse({
    status: 409,
    description: "Submission isn't eligible for disbursement.",
  })
  @UseGuards(AdminJwtAuthGuard)
  @Get(':submissionId/disburse')
  async disburseAlgos(
    @Param('submissionId') submissionId: string,
    @Query() status: DisbursementStatusDto,
  ) {
    return this.triviaService.disbursedAlgos(submissionId, status.status);
  }
}
