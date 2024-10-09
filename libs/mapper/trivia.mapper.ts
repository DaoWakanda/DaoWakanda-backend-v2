import { TriviaResponseDto } from 'libs/dto/trivia.dto';
import { Trivia } from 'libs/schema/trivia.schema';
import {
  computeTriviaMinutes,
  formatDate,
  parseMinutes,
} from 'libs/utils/parseMinute';
import { Types } from 'mongoose';

export const toTriviaResponse = (
  trivia: Trivia & { _id: Types.ObjectId },
): TriviaResponseDto => {
  return {
    id: trivia._id.toString(),
    title: trivia.title,
    duration: parseMinutes(computeTriviaMinutes(trivia.duration.toString())),
    date: formatDate(trivia.createdAt),
    difficultyLvl: trivia.difficultyLvl,
    prize: trivia.prize,
    maxWinners: trivia.maxWinners,
    description: trivia.description || '',
  };
};
