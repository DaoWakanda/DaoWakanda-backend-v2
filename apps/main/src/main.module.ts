import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'libs/utils/env';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from 'modules/auth/auth.module';
import { AdminModule } from 'modules/admin/admin.module';
import { ProposalModule } from 'modules/proposal/proposal.module';
import { ProposalController } from './controllers/proposal.controller';
import { UserController } from './controllers/user.controller';
import { UserModule } from 'modules/user/user.module';
import { TriviaController } from './controllers/trivia.controller';
import { TriviaModule } from 'modules/trivia/trivia.module';
import { UserTriviaController } from './controllers/user-trivia-controller';
import { FileUploadModule } from 'modules/file-upload/file-upload.module';
import { AdminUserController } from './controllers/admin-user-controller';
import { AdminProposalController } from './controllers/admin-proposal.controller';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGODB_URI, { dbName: env.MONGODB_DATABASE }),
    AuthModule,
    AdminModule,
    ProposalModule,
    UserModule,
    TriviaModule,
    FileUploadModule,
    //
  ],
  controllers: [
    AuthController,
    ProposalController,
    UserController,
    TriviaController,
    UserTriviaController,
    AdminUserController,
    AdminProposalController,
  ],
  providers: [],
})
export class MainModule {}
