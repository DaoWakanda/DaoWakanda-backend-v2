import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiTags,
  ApiResponse,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from 'libs/dto';
import { UploadImageDto } from 'libs/dto/upload-image.dto';
import { JwtAuthGuard } from 'libs/guards/jwt/jwt-auth.guard';
import { UserService } from 'modules/user/user.service';

@ApiTags('User Manager v2')
@Controller('v2/user')
export class UserControllerV2 {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create user details' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({
    status: 200,
    description: 'User created successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: getSchemaPath(UserResponseDto) }, // Use the reference to the UserResponseDto
      },
    },
  })
  @ApiBody({ type: CreateUserDto })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createUser(@Body() userDto: CreateUserDto, @Request() req: any) {
    return this.userService.createUser({
      ...userDto,
      walletAddress: req.user.walletAddress,
    });
  }

  @ApiOperation({ summary: 'Get user details by wallet address' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({
    status: 200,
    description: 'User details fetched successfully.',
    schema: { $ref: getSchemaPath(UserResponseDto) },
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUser(@Request() req: any) {
    const user = await this.userService.findUserByWalletAddress(
      req.user.walletAddress,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @ApiOperation({ summary: 'Update user account' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({
    status: 200,
    description: 'User created successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: getSchemaPath(UserResponseDto) },
      },
    },
  })
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  @Post('profile/update')
  updateUser(@Request() req: any, @Body() userDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.walletAddress, userDto);
  }

  @ApiOperation({ summary: 'Upload image' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('profile/upload-image')
  async uploadProfileImage(
    @Body() profileImage: UploadImageDto,
    @Request() req: any,
  ) {
    return this.userService.uploadProfileImage(
      req.user.walletAddress,
      profileImage,
    );
  }
}
