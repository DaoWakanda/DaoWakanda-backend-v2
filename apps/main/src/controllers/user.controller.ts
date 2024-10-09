import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from 'libs/dto';
import { UserService } from 'modules/user/user.service';

@ApiTags('User Manager')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create user details' })
  @ApiResponse({
    status: 200,
    description: 'User created successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: getSchemaPath(CreateUserDto) },
      },
    },
  })
  @ApiBody({ type: CreateUserDto })
  @Post('create')
  createUser(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get user details by wallet address' })
  @ApiParam({
    name: 'walletAddress',
    required: true,
    description: 'User wallet address',
  })
  @ApiResponse({
    status: 200,
    description: 'User details fetched successfully.',
    schema: { $ref: getSchemaPath(UpdateUserDto) },
  })
  @Get(':walletAddress/details')
  getUser(@Param('walletAddress') walletAddress: string) {
    return this.userService.findUserByWalletAddress(walletAddress);
  }

  @ApiOperation({ summary: 'Update user account' })
  @ApiParam({
    name: 'walletAddress',
    required: true,
    description: 'User wallet address',
  })
  @ApiResponse({
    status: 200,
    description: 'User created successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: getSchemaPath(CreateUserDto) },
      },
    },
  })
  @ApiBody({ type: UpdateUserDto })
  @Post('update/:walletAddress')
  updateUser(
    @Param('walletAddress') walletAddress: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(walletAddress, userDto);
  }
}
