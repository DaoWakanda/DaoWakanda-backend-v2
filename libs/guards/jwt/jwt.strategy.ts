import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from 'libs/constants/jwt-constants';
import { AuthService } from 'modules/auth/auth.service';
import { UserResponseDto } from 'libs/dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.adminSecret,
    });
  }

  async validate(payload: Partial<UserResponseDto>) {
    try {
      const user = await this.authService.getUserByAddress(
        payload.walletAddress,
      );
      return user;
    } catch (error) {
      console.error('JWT validation error:', error);
      throw new UnauthorizedException();
    }
  }
}
