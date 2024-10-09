import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  CreateTriviaDto,
  TriviaResponseDto,
  UpdateTriviaDto,
} from 'libs/dto/trivia.dto';
import { TriviaService } from 'modules/trivia/trivia.service';

@ApiTags('Trivia Manager')
@Controller('trivia')
export class TriviaController {
  constructor(private readonly triviaService: TriviaService) {}

  @ApiOperation({ summary: 'Create Trivia details' })
  @Post('create')
  @ApiResponse({ status: 201, description: 'Trivia created successfully.' })
  @ApiResponse({
    status: 409,
    description: 'Trivia with that title already exists.',
    type: TriviaResponseDto,
  })
  @ApiBody({ type: CreateTriviaDto })
  async createTrivia(@Body() triviaDto: CreateTriviaDto) {
    return this.triviaService.createTrivia(triviaDto);
  }

  @ApiOperation({ summary: 'List all trivias' })
  @Get('allTrivia')
  @ApiResponse({
    status: 200,
    description: 'List of all trivias.',
    type: [TriviaResponseDto],
  })
  async getAllTrivias() {
    return this.triviaService.getAllTrivias();
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

  @ApiOperation({ summary: 'Update current Trivia details' })
  @Patch(':id/update')
  @ApiResponse({ status: 200, description: 'Trivia updated successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Trivia not found or unable to update.',
    type: TriviaResponseDto,
  })
  @ApiBody({ type: UpdateTriviaDto })
  async updateTrivia(
    @Param('id') id: string,
    @Body() triviaDto: UpdateTriviaDto,
  ) {
    return this.triviaService.updateTrivia(id, triviaDto);
  }

  @ApiOperation({ summary: 'Delete current Trivia' })
  @Delete(':id/delete')
  @ApiResponse({ status: 200, description: 'Trivia deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Trivia not found.' })
  async deleteTrivia(@Param('id') id: string) {
    return this.triviaService.deleteTrivia(id);
  }
}
