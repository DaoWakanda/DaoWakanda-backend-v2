import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'libs/utils/env';
import { AdminModule as AdminServiceModule } from 'modules/admin/admin.module';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGODB_URI, { dbName: env.MONGODB_DATABASE }),
    AdminServiceModule,
  ],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
