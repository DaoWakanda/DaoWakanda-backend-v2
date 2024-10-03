import { Injectable } from '@nestjs/common';
import { AdminService } from 'modules/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { AdminDocument } from 'libs/schema/admin.schema';
import { CreateAdminDto, DeleteAdminDto } from 'libs/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private readonly jwtService: JwtService
  ) {}

  async validateAdmin(email: string, password: string) {
    return this.adminService.validateAdmin(email, password);
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
}
