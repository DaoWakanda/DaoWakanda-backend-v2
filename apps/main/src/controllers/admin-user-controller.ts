import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from 'libs/dto';
import { PageOptionsDto, PaginationResponseDto } from 'libs/dto/page.dto';
import { SubmissionResponseDto } from 'libs/dto/trivia.dto';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { TriviaService } from 'modules/trivia/trivia.service';
import { UserService } from 'modules/user/user.service';

@ApiTags('Admin Developer Manager')
@Controller('developer')
export class AdminUserController {
  constructor(
    private readonly userService: UserService,
    private readonly triviaService: TriviaService,
  ) {}

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Display list of registered users to the admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Display list of registered users to the admin',
    type: [PaginationResponseDto],
  })
  @UseGuards(AdminJwtAuthGuard)
  @Get('all')
  async getUsers(@Query() options: PageOptionsDto) {
    return this.userService.getAllUsers(options);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get user details by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Developer ID to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Developer details fetched successfully.',
    type: UserResponseDto,
  })
  @Get(':id/details')
  @UseGuards(AdminJwtAuthGuard)
  getUser(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Display list of developer submissions',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Developer ID to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Display list of developer submissions',
    type: [SubmissionResponseDto],
  })
  @UseGuards(AdminJwtAuthGuard)
  @Get(':id/submissions')
  async getAllSubmissions(@Param('id') id: string) {
    return this.triviaService.getUserSubmissions(id);
  }
}
