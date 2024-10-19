import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PageOptionsDto, PaginationResponseDto } from 'libs/dto/page.dto';
import {
  AnswerDto,
  LeaderboardResponseDto,
  TriviaResponseDto,
} from 'libs/dto/trivia.dto';
import { TriviaService } from 'modules/trivia/trivia.service';

@ApiTags('User Challenge Manager')
@Controller('user-trivia')
@UseInterceptors(ClassSerializerInterceptor)
export class UserTriviaController {
  constructor(private readonly triviaService: TriviaService) {}

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

  @ApiOperation({ summary: 'Get current Trivia details' })
  @Get(':id/detail')
  @ApiResponse({
    status: 200,
    description: 'Trivia found.',
    type: TriviaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Trivia not found.' })
  async getTriviaById(@Param('id') id: string) {
    return this.triviaService.getTriviaById(id);
  }

  @ApiOperation({ summary: 'Submit trivia answer' })
  @ApiParam({
    name: 'triviaId',
    required: true,
    description: '',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Github repository link was submitted successfully',
  })
  @Post(':triviaId/submit/:userId')
  async submitAnswer(
    @Param('userId') userId: string,
    @Param('triviaId') triviaId: string,
    @Body() answerDto: AnswerDto,
  ) {
    return this.triviaService.submitTriviaAnswer(userId, triviaId, answerDto);
  }

  @ApiOperation({ summary: 'Show leaderboard' })
  @Get('leaderboard')
  @ApiResponse({
    status: 200,
    description: 'Leaderboard displayed successfully',
    type: [LeaderboardResponseDto],
  })
  async showLeader() {
    return this.triviaService.showLeaderboard();
  }
}
