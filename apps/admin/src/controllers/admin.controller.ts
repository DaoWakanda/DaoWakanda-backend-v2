import { Controller, Get } from '@nestjs/common';
import { AdminService } from 'modules/admin/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('welcome')
  greetings() {
    return this.adminService.greetings();
  }
}
