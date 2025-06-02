import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from 'libs/constants/jwt-constants';
import { AuthService } from 'modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.adminSecret,
    });
  }

  async validate(payload: any) {
    try {
      const admin = await this.authService.validateAuthTransaction(
        payload.address,
        payload.authTxnBase64,
      );
      return admin;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
