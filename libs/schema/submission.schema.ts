import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SUBMISSION_STATUS } from 'libs/enums/status.enum';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.schema';

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema()
export class Submission extends Base {
  @ApiProperty({})
  @Prop({ required: true })
  userId: string;

  @ApiProperty({})
  @Prop({ required: true })
  triviaId: string;

  @ApiProperty({})
  @Prop({ required: true })
  githubRepoLink: string;

  @ApiProperty({})
  @Prop({ type: String, default: SUBMISSION_STATUS.PENDING })
  status: SUBMISSION_STATUS;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
