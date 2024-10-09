import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Base {
  @ApiProperty()
  @Prop({ default: '' })
  firstName: string;

  @ApiProperty()
  @Prop({ default: '' })
  lastName: string;

  @ApiProperty()
  @Prop({ default: '' })
  email: string;

  @ApiProperty()
  @Prop({ default: '' })
  image: string;

  @ApiProperty()
  @Prop({ default: '' })
  country: string;

  @ApiProperty()
  @Prop({ default: '' })
  stateOfResidence: string;

  @ApiProperty()
  @Prop({ default: '' })
  githubLink: string;

  @ApiProperty()
  @Prop({ required: true })
  walletAddress: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
