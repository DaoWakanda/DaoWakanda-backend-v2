import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthTxnLoginDto,
  CreateAdminDto,
  DeleteAdminDto,
  LogInDto,
} from 'libs/dto/auth.dto';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { AdminLocalAuthGuard } from 'libs/guards/local/admin-local-auth.guard';
import { LocalAuthGuard } from 'libs/guards/local/local-auth-guard';
import { AuthService } from 'modules/auth/auth.service';

@ApiTags('Authentication Manager')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create admin account' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: CreateAdminDto })
  @UseGuards(AdminJwtAuthGuard)
  @Post('admin')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.createAdmin(createAdminDto);
  }

  @ApiOperation({ summary: 'Sign into admin account' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: LogInDto })
  @UseGuards(AdminLocalAuthGuard)
  @Post('admin/login')
  logInAdmin(@Request() req: any) {
    return this.authService.loginAdmin(req.user);
  }

  @ApiOperation({ summary: 'Delete admin account' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: DeleteAdminDto })
  @UseGuards(AdminJwtAuthGuard)
  @Delete('admin')
  deleteAdmin(@Body() dto: DeleteAdminDto) {
    return this.authService.deleteAdmin(dto);
  }

  @ApiOperation({ summary: 'Sign into user account' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: AuthTxnLoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logInUser(@Request() req: any) {
    return this.authService.loginUser(req.user);
  }
}
