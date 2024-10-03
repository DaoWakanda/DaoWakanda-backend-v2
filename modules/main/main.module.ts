import { Module } from '@nestjs/common';
import { MainService } from './main.service';

@Module({
  providers: [MainService],
})
export class MainModule {}
