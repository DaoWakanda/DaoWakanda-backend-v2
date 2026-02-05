import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AnswerDto,
  LeaderboardResponseDto,
  SubmissionResponseDto,
} from 'libs/dto/trivia.dto';
import { JwtAuthGuard } from 'libs/guards/jwt/jwt-auth.guard';
import { TriviaService } from 'modules/trivia/trivia.service';

@ApiTags('User Challenge Manager v2')
@Controller('v2/challenges')
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserTriviaControllerV2 {
  constructor(private readonly triviaService: TriviaService) {}

  @ApiOperation({ summary: 'Submit trivia answer' })
  @ApiParam({
    name: 'triviaId',
    required: true,
    description: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Github repository link was submitted successfully',
  })
  @Post(':triviaId/submit')
  async submitAnswer(
    @Param('triviaId') triviaId: string,
    @Request() req: any,
    @Body() answerDto: AnswerDto,
  ) {
    const user = req.user;

    if (!user.id) {
      throw new NotFoundException('User not found. Please create a profile.');
    }

    return this.triviaService.submitTriviaAnswer(user.id, triviaId, answerDto);
  }

  @ApiOperation({ summary: 'Get user unclaimed bounty' })
  @ApiResponse({
    status: 200,
    description: 'List of all unclaimed bounty.',
    type: [SubmissionResponseDto],
  })
  @Get('unclaimed-bounty')
  async getUserUnclaimedBounty(@Request() req: any) {
    const address = req.user.walletAddress;
    return this.triviaService.getUserUnclaimedBounty(address);
  }

  @ApiOperation({ summary: 'Claim algos' })
  @ApiResponse({ status: 200, description: 'Algos claimed successfully.' })
  @Patch(':submissionId/claim')
  async claimBounty(
    @Param('submissionId') submissionId: string,
    @Request() req: any,
  ) {
    const submission = await this.triviaService.getSubmissionById(submissionId);
    const user = req.user;

    if (submission.userId !== user.id) {
      throw new NotFoundException(
        'You are not authorized to claim this bounty.',
      );
    }

    return this.triviaService.claimAlgos(submissionId);
  }

  @ApiOperation({ summary: 'Get trivia leaderboard' })
  @ApiResponse({
    status: 200,
    description: 'Trivia leaderboard displayed successfully',
    type: [LeaderboardResponseDto],
  })
  @Get(':triviaId/leaderboard')
  async getTriviaLeaderboard(@Param('triviaId') triviaId: string) {
    return this.triviaService.getTriviaLeaderboard(triviaId);
  }
}
