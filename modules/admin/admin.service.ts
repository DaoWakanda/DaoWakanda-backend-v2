import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminDto } from 'libs/dto';
import { BcryptService } from 'libs/injectables';
import { Admin, AdminDocument } from 'libs/schema/admin.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,

    private readonly bcryptService: BcryptService
  ) {}

  async createAdmin(email: string, password: string) {
    const existingAdmin = await this.findAdminByEmail(email);

    if (existingAdmin) {
      throw new ForbiddenException('Admin with that email already exists.');
    }

    const admin = new this.adminModel({
      email,
      password: await this.bcryptService.hash(password),
    });
    return admin.save();
  }

  async findAdminByEmail(email: string): Promise<AdminDocument> {
    const admin = await this.adminModel
      .findOne({
        email,
      })
      .exec();

    return admin;
  }

  async validateAdmin(email: string, password: string): Promise<AdminDto> {
    const admin = await this.findAdminByEmail(email);

    if (!admin) throw new NotFoundException('Invalid email address');

    const isValid = await this.bcryptService.compare(password, admin.password);

    if (isValid) {
      return { email: admin.email, id: admin.id };
    }
  }

  async deleteAdmin(email: string) {
    const admin = await this.findAdminByEmail(email);

    if (!admin)
      throw new NotFoundException(
        'No admin with the supplied email address exists.'
      );

    return await this.adminModel.deleteOne({ email }).exec();
  }
}
