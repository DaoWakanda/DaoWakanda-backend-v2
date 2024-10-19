import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'libs/schema/user.schema';
import { FileUploadModule } from 'modules/file-upload/file-upload.module';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    FileUploadModule,
  ],
  exports: [UserService],
})
export class UserModule {}
