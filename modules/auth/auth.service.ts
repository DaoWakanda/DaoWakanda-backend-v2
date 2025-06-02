import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'modules/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { AdminDocument } from 'libs/schema/admin.schema';
import { ed25519 } from '@noble/curves/ed25519';
import algosdk from 'algosdk';
import {
  CreateAdminDto,
  DaowakandaUserDto,
  DeleteAdminDto,
} from 'libs/dto/auth.dto';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private adminService: AdminService,
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateAdmin(email: string, password: string) {
    return this.adminService.validateAdmin(email, password);
  }

  async loginUser(user: DaowakandaUserDto) {
    return {
      accessToken: this.jwtService.sign(user, { expiresIn: 86400 }),
      expiresIn: 86400,
    };
  }

  async loginAdmin(user: AdminDocument) {
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: 86400 }),
      expiresIn: 86400,
    };
  }

  async createAdmin(dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto.email, dto.password);
  }

  async deleteAdmin(dto: DeleteAdminDto) {
    return this.adminService.deleteAdmin(dto.email);
  }

  async validateAuthTransaction(
    address: string,
    txnBase64: string,
  ): Promise<DaowakandaUserDto> {
    try {
      const txnByteArray = new Uint8Array(Buffer.from(txnBase64, 'base64'));
      const decodedTxn = algosdk.decodeSignedTransaction(txnByteArray);

      const from = algosdk.encodeAddress(decodedTxn.txn.sender.publicKey);
      const to = algosdk.encodeAddress(
        decodedTxn.txn.payment?.receiver.publicKey,
      );

      if (from !== to) {
        throw new UnauthorizedException('Invalid auth transaction');
      }

      if (from !== address)
        throw new UnauthorizedException('Unrecognized auth transaction sender');

      const publicKey = algosdk.decodeAddress(address).publicKey;
      const publicKeyHex = Buffer.from(publicKey).toString('hex');

      const isValid = ed25519.verify(
        decodedTxn.sig!,
        decodedTxn.txn!.bytesToSign(),
        new Uint8Array(Buffer.from(publicKeyHex, 'hex')),
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid auth transaction signer');
      } else {
        const user = await this.userService.findUserByWalletAddress(address);

        return {
          address,
          user,
        };
      }
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid auth transaction');
    }
  }
}
