import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateTriviaDto,
  TriviaResponseDto,
  UpdateTriviaDto,
} from 'libs/dto/trivia.dto';
import { toTriviaResponse } from 'libs/mapper/trivia.mapper';
import { Trivia } from 'libs/schema/trivia.schema';
import { Model } from 'mongoose';

@Injectable()
export class TriviaService {
  constructor(
    @InjectModel(Trivia.name) private readonly triviaRepo: Model<Trivia>,
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

  async getAllTrivias(): Promise<TriviaResponseDto[]> {
    const allTrivias = await this.triviaRepo.find().exec();

    const triviaResponse = allTrivias.map((trivia) => toTriviaResponse(trivia));

    return triviaResponse;
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
}
