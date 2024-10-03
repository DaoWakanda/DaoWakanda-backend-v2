import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'libs/schema/admin.schema';
import { BcryptService } from 'libs/injectables';

@Module({
  providers: [AdminService, BcryptService],
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  exports: [AdminService],
})
export class AdminModule {}
