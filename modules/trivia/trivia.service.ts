/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PageMetaDto,
  PageOptionsDto,
  PaginationResponseDto,
  SubmissionPageOptionsDto,
} from 'libs/dto/page.dto';
import {
  AnswerDto,
  CreateTriviaDto,
  LeaderboardResponseDto,
  SubmissionResponseDto,
  TriviaResponseDto,
  UpdateTriviaDto,
} from 'libs/dto/trivia.dto';
import { ERROR } from 'libs/enums/error.enum';
import { Order } from 'libs/enums/order.enum';
import {
  DISBURSED_STATUS,
  DISBURSEMENT_STATUS,
  REVIEW_STATUS,
  SUBMISSION_STATUS,
  TRIVIA_STATUS,
} from 'libs/enums/status.enum';
import { IdObject } from 'libs/interfaces';
import {
  toSubmissionResponse,
  toTriviaResponse,
} from 'libs/mapper/trivia.mapper';
import { toLeaderBoard } from 'libs/mapper/user.mapper';
import { Submission } from 'libs/schema/submission.schema';
import { Trivia } from 'libs/schema/trivia.schema';
import { createPageOptionFallBack } from 'libs/utils/createPageOptionFallBack';
import { AlgorandService } from 'modules/algorand/algorand.service';
import { UserService } from 'modules/user/user.service';
import { Model } from 'mongoose';

@Injectable()
export class TriviaService {
  constructor(
    @InjectModel(Trivia.name)
    private readonly triviaRepo: Model<Trivia>,

    @InjectModel(Submission.name)
    private readonly submissionRepo: Model<Submission>,

    private readonly userService: UserService,

    private readonly algorandService: AlgorandService,
  ) {}

  async createTrivia(triviaDto: CreateTriviaDto) {
    const existingTrivia = await this.triviaRepo.findOne({
      title: triviaDto.title,
    });

    if (existingTrivia) {
      throw new ConflictException('Trivia with that title already exists.');
    }

    const trivia = new this.triviaRepo(triviaDto);

    const createdTrivia = await trivia.save();

    return {
      message: 'Trivia created successfully',
      createdTrivia: toTriviaResponse(createdTrivia),
    };
  }

  async getAllTrivias(
    options: PageOptionsDto,
  ): Promise<PaginationResponseDto<TriviaResponseDto>> {
    const pageOptionsDtoFallBack = createPageOptionFallBack(options);
    const { order, skip, numOfItemsPerPage, difficulty, status, searchTerm } =
      pageOptionsDtoFallBack;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    const query: any = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (status) {
      query.status = status;
    }

    const [allTrivias, itemCount] = await Promise.all([
      this.triviaRepo
        .find(query)
        .sort({ createdAt: order === Order.ASC ? 1 : -1 })
        .skip(skip)
        .limit(numOfItemsPerPage)
        .exec(),
      this.triviaRepo.countDocuments(query).exec(),
    ]);

    const triviaResponse = await Promise.all(
      allTrivias.map(async (trivia) => {
        if (this.hasTimeElapsed(trivia.endTimeStamp)) {
          await this.triviaRepo
            .findByIdAndUpdate(trivia._id, { status: 'expired' }, { new: true })
            .exec();
          trivia.status = TRIVIA_STATUS.EXPIRED;
        }

        return toTriviaResponse(trivia);
      }),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    return {
      data: triviaResponse,
      pagination: pageMetaDto,
    };
  }

  async getTriviaById(id: string) {
    const trivia = await this.triviaRepo.findById(id).exec();

    if (!trivia) {
      throw new NotFoundException('Trivia not found.');
    }

    const response = toTriviaResponse(trivia);
    return response;
  }

  async updateTrivia(id: string, triviaDto: UpdateTriviaDto) {
    const existingTrivia = await this.triviaRepo.findById(id).exec();

    if (!existingTrivia) {
      throw new NotFoundException('Trivia not found.');
    }

    let newEndTimeStamp = existingTrivia.endTimeStamp;

    if (triviaDto.duration) {
      newEndTimeStamp = Date.now() + triviaDto.duration * 1000;
    }

    let newStatus = existingTrivia.status;
    if (
      newEndTimeStamp > Date.now() &&
      existingTrivia.status === TRIVIA_STATUS.EXPIRED
    ) {
      newStatus = TRIVIA_STATUS.ONGOING;
    }

    const updatedTrivia = await this.triviaRepo
      .findOneAndUpdate(
        { _id: id },
        {
          ...triviaDto,
          updatedAt: new Date(),
          status: newStatus,
        },
        { new: true },
      )
      .exec();

    if (!updatedTrivia) {
      throw new NotFoundException('Trivia not found or unable to update.');
    }

    return {
      message: 'Trivia updated successfully',
      updatedTrivia: toTriviaResponse(updatedTrivia),
    };
  }

  async deleteTrivia(id: string) {
    const trivia = await this.triviaRepo.findById(id).exec();

    if (!trivia) {
      throw new NotFoundException('Trivia not found.');
    }

    await this.triviaRepo.deleteOne({ _id: trivia._id }).exec();

    return { message: 'Trivia deleted successfully' };
  }

  async submitTriviaAnswer(
    userId: string,
    triviaId: string,
    answerDto: AnswerDto,
  ) {
    const { githubRepoLink } = answerDto;

    const [user, trivia] = await Promise.all([
      this.userService.findUserById(userId),
      this.triviaRepo.findById(triviaId).exec(),
    ]);

    if (!trivia) {
      throw new NotFoundException(ERROR.TRIVIA_NOT_FOUND);
    }

    if (this.hasTimeElapsed(trivia.endTimeStamp)) {
      throw new ConflictException(ERROR.TRIVIA_EXPIRED);
    }

    const existingSubmission = await this.submissionRepo
      .findOne({
        userId: user.id,
        triviaId,
      })
      .exec();

    if (existingSubmission) {
      throw new ConflictException(ERROR.DUPLICATE_SUBMISSION);
    }

    await new this.submissionRepo({
      userId,
      triviaId,
      githubRepoLink,
    }).save();

    return { message: 'Github repository link was submitted successfully' };
  }

  async getAllSubmissions(
    options: SubmissionPageOptionsDto,
  ): Promise<PaginationResponseDto<SubmissionResponseDto>> {
    const { order, numOfItemsPerPage, filterBy, page, skip } = options;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    let query = {};
    if (filterBy) {
      query = { submissionStatus: filterBy };
    }

    const [allSubmission, itemCount] = await Promise.all([
      this.submissionRepo
        .find(query)
        .sort({ createdAt: order === Order.ASC ? 1 : -1 })
        .skip(skip)
        .limit(numOfItemsPerPage)
        .exec(),
      this.submissionRepo.countDocuments(query).exec(),
    ]);

    const submissions = await Promise.all(
      allSubmission.map(async (submission) => {
        const user = await this.userService.findUserById(submission.userId);
        const submissionResponse = toSubmissionResponse(submission);
        const trivia = await this.getTriviaById(submission.triviaId);

        return {
          title: trivia.title || '',
          developer: `${user.firstName} ${user.lastName}`,
          wallet: user.walletAddress,
          ...submissionResponse,
        };
      }),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: options,
    });

    return {
      data: submissions,
      pagination: pageMetaDto,
    };
  }

  async reviewSubmission(submissionId: string, review: REVIEW_STATUS) {
    const submission = await this.submissionRepo.findById(submissionId).exec();

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} was not found`,
      );
    }

    if (
      submission.submissionStatus === SUBMISSION_STATUS.APPROVED ||
      submission.submissionStatus === SUBMISSION_STATUS.REJECTED
    ) {
      throw new ConflictException(
        `Submission with ID ${submissionId} has already been reviewed`,
      );
    }

    if (review === REVIEW_STATUS.APPROVED) {
      const trivia = await this.triviaRepo.findById(submission.triviaId).exec();

      if (trivia.winners === trivia.maxWinners) {
        throw new ConflictException(`All winners have already been awarded`);
      }

      await this.triviaRepo
        .findOneAndUpdate(
          { _id: trivia._id },
          { $inc: { winners: 1 } },
          { new: true },
        )
        .exec();
    }

    const updatedSubmission = await this.submissionRepo
      .findOneAndUpdate(
        { _id: submission._id },
        {
          submissionStatus:
            review === REVIEW_STATUS.APPROVED
              ? SUBMISSION_STATUS.APPROVED
              : SUBMISSION_STATUS.REJECTED,
          disbursementStatus:
            review === REVIEW_STATUS.APPROVED
              ? DISBURSEMENT_STATUS.ELIGIBLE
              : DISBURSEMENT_STATUS.NOT_ELIGIBLE,
        },
        {
          new: true,
        },
      )
      .exec();

    return {
      message: 'Submission has been reviewed successfully',
    };
  }

  async disburseAlgos(contractId: number, submissionId: string) {
    const submission = await this.submissionRepo.findById(submissionId).exec();

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} was not found`,
      );
    }

    if (submission.submissionStatus === SUBMISSION_STATUS.REJECTED) {
      throw new ConflictException(
        `Submission with ID ${submissionId} isn't eligible for disbursement`,
      );
    }

    const user = await this.userService.findUserById(submission.userId);

    const trivia = await this.triviaRepo.findById(submission.triviaId).exec();

    const isAmountDisbursed = await this.algorandService.isAmountDisbursed(
      contractId,
      user.walletAddress,
      trivia.prize,
    );

    if (!isAmountDisbursed) {
      throw new ConflictException(
        'The specified amount has not been disbursed.',
      );
    }

    const updatedSubmission = await this.submissionRepo
      .findOneAndUpdate(
        { _id: submission._id },
        {
          disbursementStatus: DISBURSED_STATUS.DISBURSED,
          smartContractId: contractId,
        },
        {
          new: true,
        },
      )
      .lean()
      .exec();

    const result = await this.awardAlgosToDeveloper(updatedSubmission);

    return result;
  }

  async awardAlgosToDeveloper(submission: Submission & IdObject) {
    try {
      const trivia = await this.triviaRepo.findById(submission.triviaId).exec();

      if (submission.disbursementStatus === DISBURSEMENT_STATUS.DISBURSED) {
        if (trivia?.prize) {
          return await this.userService.awardAlgos(
            submission.userId,
            trivia.prize,
          );
        } else {
          return {
            success: false,
            message: `No prize found for trivia ID ${submission.triviaId}.`,
          };
        }
      }
    } catch (error) {
      console.error('Error awarding algos to developer:', error);
      return {
        success: false,
        message: `Failed to award algos to developer for submission ID ${submission._id}. Error: ${error.message}`,
      };
    }
  }

  async claimAlgos(submissionId: string) {
    const submission = await this.submissionRepo.findById(submissionId).exec();

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} was not found`,
      );
    }

    if (submission.disbursementStatus !== DISBURSEMENT_STATUS.DISBURSED) {
      throw new ConflictException(
        `Submission with ID ${submissionId} isn't eligible for claim`,
      );
    }

    await this.submissionRepo
      .findOneAndUpdate(
        { _id: submission._id },
        {
          disbursementStatus: DISBURSEMENT_STATUS.CLAIMED,
        },
        {
          new: true,
        },
      )
      .lean()
      .exec();

    return {
      status: 200,
      message: 'Claim was successfully',
    };
  }

  async getSubmissionById(submissionId: string) {
    const submission = await this.submissionRepo.findById(submissionId).exec();

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} was not found`,
      );
    }

    return toSubmissionResponse(submission);
  }

  async showLeaderboard(): Promise<LeaderboardResponseDto[]> {
    const users = await this.userService.getUsers();

    const leaderboard = users.map((user) => toLeaderBoard(user));

    return leaderboard;
  }

  private hasTimeElapsed(endTimeStamp: number): boolean {
    const currentTime = Date.now();
    return currentTime >= endTimeStamp;
  }

  async getUserSubmissions(userId: string): Promise<SubmissionResponseDto[]> {
    const user = await this.userService.findUserById(userId);

    const submissions = await this.submissionRepo
      .find({ userId: user.id })
      .lean()
      .exec();

    const userSubmissions = await Promise.all(
      submissions.map(async (submission) => {
        const trivia = await this.getTriviaById(submission.triviaId);
        const submissionResponse = toSubmissionResponse(submission);

        return {
          title: trivia.title || '',
          ...submissionResponse,
        };
      }),
    );

    return userSubmissions;
  }

  async getSubmissionsByTrivia(triviaId: string) {
    const trivia = await this.getTriviaById(triviaId);

    const submissions = await this.submissionRepo
      .find({ triviaId })
      .lean()
      .exec();

    const submissionsByTrivia = await Promise.all(
      submissions.map(async (submission) => {
        const user = await this.userService.findUserById(submission.userId);
        const submissionResponse = toSubmissionResponse(submission);

        return {
          developer: `${user.firstName} ${user.lastName}`,
          walletAddress: user.walletAddress,
          bounty: trivia.prize,
          ...submissionResponse,
        };
      }),
    );

    return submissionsByTrivia;
  }

  async getWinnersByTrivia(triviaId: string) {
    const submissions = await this.submissionRepo
      .find({ triviaId, submissionStatus: SUBMISSION_STATUS.APPROVED })
      .lean()
      .exec();

    const winnersByTrivia = await Promise.all(
      submissions.map(async (submission) => {
        const user = await this.userService.findUserById(submission.userId);

        return user;
      }),
    );

    return winnersByTrivia;
  }

  async getUserUnclaimedBounty(
    address: string,
  ): Promise<SubmissionResponseDto[]> {
    const user = await this.userService.findUserByWalletAddress(address);

    const submissions = await this.submissionRepo
      .find({
        userId: user.id,
        disbursementStatus: DISBURSEMENT_STATUS.DISBURSED,
      })
      .lean()
      .exec();

    const userSubmissions = await Promise.all(
      submissions
        .filter((submission) => !!submission.smartContractId)
        .map(async (submission) => {
          const trivia = await this.getTriviaById(submission.triviaId);
          const submissionResponse = toSubmissionResponse(submission);

          return {
            title: trivia.title || '',
            smartContractId: submission.smartContractId,
            bounty: trivia.prize,
            ...submissionResponse,
          };
        }),
    );

    return userSubmissions;
  }
}
