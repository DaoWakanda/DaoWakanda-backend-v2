import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Base } from './base.schema';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { DIFFICULTY_LEVEL } from 'libs/enums/difficulty.enum';
import { TRIVIA_STATUS } from 'libs/enums/status.enum';

export type TriviaDocument = HydratedDocument<Trivia>;

@Schema()
export class Trivia extends Base {
  @ApiProperty({ description: 'Title of the trivia' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Duration of the trivia in seconds' })
  @Prop({ required: true })
  duration: number;

  @ApiProperty({ description: 'Timestamp for when the trivia ends' })
  @Prop({})
  endTimeStamp: number;

  @ApiProperty({
    description: 'Difficulty level of the trivia',
    enum: DIFFICULTY_LEVEL,
  })
  @Prop({ required: true, type: String, enum: DIFFICULTY_LEVEL })
  difficulty: DIFFICULTY_LEVEL;

  @ApiProperty({ description: 'Prize amount for the trivia winner' })
  @Prop({ required: true })
  prize: number;

  @ApiProperty({ description: 'Maximum number of allowed winners' })
  @Prop({ required: true })
  maxWinners: number;

  @ApiProperty({ description: 'number of winners' })
  @Prop({ default: 0 })
  winners: number;

  @ApiProperty({ description: 'Description of the trivia' })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'Skill involved in the trivia',
  })
  @Prop({})
  skill: string;

  @ApiProperty({ description: 'Status of the trivia' })
  @Prop({ required: true, type: String, default: TRIVIA_STATUS.ONGOING })
  status: TRIVIA_STATUS;
}

export const TriviaSchema = SchemaFactory.createForClass(Trivia);

TriviaSchema.pre<Trivia>('save', function (next) {
  if (!this.endTimeStamp) {
    this.endTimeStamp = Math.floor(
      new Date(this.createdAt).valueOf() + this.duration * 1000,
    );
  }
  this.updatedAt = new Date();

  next();
});
