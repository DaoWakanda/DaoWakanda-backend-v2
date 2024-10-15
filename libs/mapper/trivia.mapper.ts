import { TriviaResponseDto } from 'libs/dto/trivia.dto';
import { Submission } from 'libs/schema/submission.schema';
import { Trivia } from 'libs/schema/trivia.schema';
import { computeTriviaMinutes, parseMinutes } from 'libs/utils/parseMinute';
import { Types } from 'mongoose';

export const toTriviaResponse = (
  trivia: Trivia & { _id: Types.ObjectId },
): TriviaResponseDto => {
  return {
    id: trivia._id.toString(),
    title: trivia.title,
    duration: parseMinutes(computeTriviaMinutes(trivia.duration.toString())),
    createdAt: trivia.createdAt,
    endTimeStamp: trivia.endTimeStamp,
    difficulty: trivia.difficulty,
    prize: trivia.prize,
    maxWinners: trivia.maxWinners,
    winnersCount: trivia.winners,
    skill: trivia.skill,
    description: trivia.description || '',
    status: trivia.status,
  };
};

export const toSubmissionResponse = (
  submission: Submission & { _id: Types.ObjectId },
) => {
  return {
    id: submission._id.toString(),
    repoLink: submission.githubRepoLink,
    status: submission.status,
  };
};
