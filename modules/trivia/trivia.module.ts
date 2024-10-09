import { Module } from '@nestjs/common';
import { TriviaService } from './trivia.service';
import { Trivia, TriviaSchema } from 'libs/schema/trivia.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [TriviaService],
  imports: [
    MongooseModule.forFeature([{ name: Trivia.name, schema: TriviaSchema }]),
  ],
  exports: [TriviaService],
})
export class TriviaModule {}
