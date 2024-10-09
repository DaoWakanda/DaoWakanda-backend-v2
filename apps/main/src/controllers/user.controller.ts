import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from 'libs/dto';
import { UserService } from 'modules/user/user.service';

@ApiTags('User Manager')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create user details' })
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
  @ApiBody({ type: UpdateUserDto })
  @Post('update/:walletAddress')
  updateUser(
    @Param('walletAddress') walletAddress: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(walletAddress, userDto);
  }
}
