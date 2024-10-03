import { Module } from '@nestjs/common';
import { AdminService } from 'modules/admin/admin.service';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
