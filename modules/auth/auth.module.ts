import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminModule } from 'modules/admin/admin.module';
import { LocalAdminStrategy } from 'libs/guards/local/local-admin.strategy';
import { JwtAdminStrategy } from 'libs/guards/jwt/jwt-admin.strategy';
import { BcryptService } from 'libs/injectables';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'libs/constants/jwt-constants';

@Module({
  providers: [AuthService, LocalAdminStrategy, JwtAdminStrategy, BcryptService],
  imports: [
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.adminSecret,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
