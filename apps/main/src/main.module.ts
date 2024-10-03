import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'libs/utils/env';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from 'modules/auth/auth.module';
import { AdminModule } from 'modules/admin/admin.module';
import { ProposalModule } from 'modules/proposal/proposal.module';
import { ProposalController } from './controllers/proposal.controller';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGODB_URI, { dbName: env.MONGODB_DATABASE }),
    AuthModule,
    AdminModule,
    ProposalModule,
  ],
  controllers: [AuthController, ProposalController],
  providers: [],
})
export class MainModule {}
