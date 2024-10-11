/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PageMetaDto,
  PageOptionsDto,
  PaginationResponseDto,
} from 'libs/dto/page.dto';
import {
  AnswerDto,
  CreateTriviaDto,
  LeaderboardResponseDto,
  TriviaResponseDto,
  UpdateTriviaDto,
} from 'libs/dto/trivia.dto';
import { ERROR } from 'libs/enums/error.enum';
import { Order } from 'libs/enums/order.enum';
import {
  REVIEW_STATUS,
  SUBMISSION_STATUS,
  TRIVIA_STATUS,
} from 'libs/enums/status.enum';
import {
  toSubmissionResponse,
  toTriviaResponse,
} from 'libs/mapper/trivia.mapper';
import { toLeaderBoard } from 'libs/mapper/user.mapper';
import { Submission } from 'libs/schema/submission.schema';
import { Trivia } from 'libs/schema/trivia.schema';
import { createPageOptionFallBack } from 'libs/utils/createPageOptionFallBack';
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
    const { order, skip, numOfItemsPerPage, filterBy, searchTerm } =
      pageOptionsDtoFallBack;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    const query: any = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    if (filterBy) {
      query.difficulty = filterBy;
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
        if (this.hasTimeElapsed(trivia.createdAt, trivia.duration)) {
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
    const updatedTrivia = await this.triviaRepo
      .findOneAndUpdate(
        { _id: id },
        {
          ...triviaDto,
          updatedAt: new Date(),
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

    if (this.hasTimeElapsed(trivia.createdAt, trivia.duration)) {
      throw new ConflictException(ERROR.TRIVIA_EXPIRED);
    }

    const existingSubmission = await this.submissionRepo
      .findOne({
        userId,
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
    options: PageOptionsDto,
  ): Promise<PaginationResponseDto<{ id: string; status: SUBMISSION_STATUS }>> {
    const pageOptionsDtoFallBack = createPageOptionFallBack(options);
    const { order, skip, numOfItemsPerPage } = pageOptionsDtoFallBack;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    const [allSubmission, itemCount] = await Promise.all([
      this.submissionRepo
        .find()
        .sort({ createdAt: order === Order.ASC ? 1 : -1 })
        .skip(skip)
        .limit(numOfItemsPerPage)
        .exec(),
      this.submissionRepo.countDocuments().exec(),
    ]);

    const submissions = await Promise.all(
      allSubmission.map(async (submission) => {
        return toSubmissionResponse(submission);
      }),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    return {
      data: submissions,
      pagination: pageMetaDto,
    };
  }

  async approveAnswer(submissionId: string, review: REVIEW_STATUS) {
    const submission = await this.submissionRepo.findById(submissionId).exec();

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} was not found`,
      );
    }

    if (
      submission.status === SUBMISSION_STATUS.PASSED ||
      submission.status === SUBMISSION_STATUS.FAILED
    ) {
      throw new ConflictException(
        `Submission with ID ${submissionId} has already been reviewed`,
      );
    }

    const trivia = await this.triviaRepo.findById(submission.triviaId).exec();

    if (trivia.status === TRIVIA_STATUS.EXPIRED) {
      throw new GoneException('This Trivia is no longer available');
    }

    if (trivia.winners === trivia.maxWinners) {
      throw new ConflictException(`All winners have already been awarded`);
    }

    const updatedSubmission = await this.submissionRepo
      .findOneAndUpdate(
        { _id: submission._id },
        {
          status:
            review === REVIEW_STATUS.PASSED
              ? SUBMISSION_STATUS.PASSED
              : SUBMISSION_STATUS.FAILED,
        },
        {
          new: true,
        },
      )
      .exec();

    if (review === REVIEW_STATUS.PASSED) {
      await this.awardAlgos(updatedSubmission);

      await this.triviaRepo
        .findOneAndUpdate(
          { _id: trivia._id },
          { $inc: { winners: 1 } },
          { new: true },
        )
        .exec();
    }

    return {
      message: 'Submission has been reviewed successfully',
    };
  }

  async awardAlgos(submission: any) {
    const trivia = await this.triviaRepo.findById(submission.triviaId).exec();

    if (trivia?.prize) {
      await this.userService.awardAlgos(submission.userId, trivia.prize);
    }
  }

  async showLeaderboard(): Promise<LeaderboardResponseDto[]> {
    const users = await this.userService.getAllUsers();

    const leaderboard = users.map((user) => toLeaderBoard(user));

    return leaderboard;
  }

  private hasTimeElapsed(createdAt: Date, duration: number): boolean {
    const currentTime = new Date();
    const expirationTime = new Date(createdAt.getTime() + duration * 1000);

    return currentTime >= expirationTime;
  }
}
