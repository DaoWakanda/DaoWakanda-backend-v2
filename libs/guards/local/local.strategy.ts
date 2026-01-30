import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'address', passwordField: 'authTxnBase64' });
  }

  async validate(address: string, authTxnBase64: string): Promise<any> {
    const user = await this.authService.validateAuthTransaction(
      address,
      authTxnBase64,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
