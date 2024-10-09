import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from './base.schema';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { DIFFICULTY_LEVEL } from 'libs/enums/difficulty.enum';

export type TriviaDocument = HydratedDocument<Trivia>;

@Schema()
export class Trivia extends Base {
  @ApiProperty({ description: 'Title of the trivia' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Duration of the trivia in seconds' })
  @Prop({ required: true })
  duration: number;

  @ApiProperty({
    description: 'Difficulty level of the trivia',
    enum: DIFFICULTY_LEVEL,
  })
  @Prop({ required: true, type: String, enum: DIFFICULTY_LEVEL })
  difficultyLvl: DIFFICULTY_LEVEL;

  @ApiProperty({ description: 'Prize amount for the trivia winner' })
  @Prop({ required: true })
  prize: number;

  @ApiProperty({ description: 'Maximum number of winners' })
  @Prop({ required: true })
  maxWinners: number;

  @ApiProperty({ description: 'Description of the trivia' })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'Skill involved in the trivia',
  })
  @Prop({ required: true })
  skill: string;
}

export const TriviaSchema = SchemaFactory.createForClass(Trivia);
