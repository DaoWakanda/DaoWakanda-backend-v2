import { Module } from '@nestjs/common';
import { TriviaService } from './trivia.service';
import { Trivia, TriviaSchema } from 'libs/schema/trivia.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from 'libs/schema/submission.schema';
import { UserModule } from 'modules/user/user.module';
import { AlgorandService } from 'modules/algorand/algorand.service';

@Module({
  providers: [TriviaService, AlgorandService],
  imports: [
    MongooseModule.forFeature([
      { name: Trivia.name, schema: TriviaSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    UserModule,
  ],
  exports: [TriviaService],
})
export class TriviaModule {}
