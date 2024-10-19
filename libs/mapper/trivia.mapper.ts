import { TriviaResponseDto } from 'libs/dto/trivia.dto';
import { IdObject } from 'libs/interfaces';
import { Submission } from 'libs/schema/submission.schema';
import { Trivia } from 'libs/schema/trivia.schema';
import { computeTriviaMinutes, parseMinutes } from 'libs/utils/parseMinute';

export const toTriviaResponse = (
  trivia: Trivia & IdObject,
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

export const toSubmissionResponse = (submission: Submission & IdObject) => {
  return {
    id: submission._id.toString(),
    githubLink: submission.githubRepoLink,
    submissionStatus: submission.submissionStatus,
    disbursementStatus: submission.disbursementStatus,
    createdAt: submission.createdAt,
  };
};
