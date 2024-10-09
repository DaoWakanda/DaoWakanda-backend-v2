import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PageMetaDto,
  PageOptionsDto,
  PaginationResponseDto,
} from 'libs/dto/page.dto';
import { CreateTriviaDto, UpdateTriviaDto } from 'libs/dto/trivia.dto';
import { Order } from 'libs/enums/order.enum';
import { toTriviaResponse } from 'libs/mapper/trivia.mapper';
import { Trivia } from 'libs/schema/trivia.schema';
import { createPageOptionFallBack } from 'libs/utils/createPageOptionFallBack';
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

  async getAllTrivias(options: PageOptionsDto): Promise<PaginationResponseDto> {
    const pageOptionsDtoFallBack = createPageOptionFallBack(options);
    const { order, skip, numOfItemsPerPage } = pageOptionsDtoFallBack;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    const [allTrivias, itemCount] = await Promise.all([
      this.triviaRepo
        .find()
        .sort({ createdAt: order === Order.ASC ? 1 : -1 })
        .skip(skip)
        .limit(numOfItemsPerPage)
        .exec(),
      this.triviaRepo.countDocuments().exec(),
    ]);

    const triviaResponse = allTrivias.map((trivia) => toTriviaResponse(trivia));

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
}
