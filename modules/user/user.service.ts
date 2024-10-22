import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from 'libs/dto';
import { PageMetaDto, PageOptionsDto } from 'libs/dto/page.dto';
import { UploadImageDto } from 'libs/dto/upload-image.dto';
import { Order } from 'libs/enums/order.enum';
import { toUserResponse } from 'libs/mapper/user.mapper';
import { User } from 'libs/schema/user.schema';
import { createPageOptionFallBack } from 'libs/utils/createPageOptionFallBack';
import { FileUploadService } from 'modules/file-upload/file-upload.service';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userRepo: Model<User>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createUser(data: CreateUserDto) {
    const existingUser = await this.findUserByWalletAddress(data.walletAddress);

    if (existingUser) {
      throw new ConflictException(
        'User with that wallet address already exists.',
      );
    }

    const createdUser = new this.userRepo(data);
    const savedUser = await createdUser.save();

    return {
      message: 'User created successfully',
      createdUser: toUserResponse(savedUser),
    };
  }

  async findUserByWalletAddress(address: string) {
    const user = await this.userRepo
      .findOne({ walletAddress: address })
      .lean()
      .exec();

    const userResponse = toUserResponse(user);

    if (user) {
      return userResponse;
    }

    return null;
  }

  async getAllUsers(options: PageOptionsDto) {
    const pageOptionsDtoFallBack = createPageOptionFallBack(options);
    const { order, skip, numOfItemsPerPage } = pageOptionsDtoFallBack;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    const [allUsers, itemCount] = await Promise.all([
      this.userRepo
        .find()
        .sort({ algos: -1 })
        .skip(skip)
        .limit(numOfItemsPerPage)
        .exec(),
      this.userRepo.countDocuments().exec(),
    ]);

    const userResponse = allUsers.map((user) => toUserResponse(user));

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    return {
      data: userResponse,
      pageMetaDto,
    };
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepo
      .find()
      .where('awardedAlgos')
      .gte(1)
      .sort({ awardedAlgos: -1 })
      .lean()
      .exec();
  }

  async findUserById(userId: string) {
    const user = await this.userRepo.findById(userId).lean().exec();

    if (!user) throw new NotFoundException('User not found');

    return toUserResponse(user);
  }

  async updateUser(address: string, data: UpdateUserDto) {
    const user = await this.findUserByWalletAddress(address);

    if (!user)
      throw new NotFoundException(
        'No user found with that wallet address exists',
      );

    const updatedUser = await this.userRepo
      .findByIdAndUpdate(
        user.id,
        {
          ...data,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Unable to update the user');
    }

    return {
      message: 'User updated successfully',
      updatedUser: toUserResponse(updatedUser),
    };
  }

  async awardAlgos(userId: string, algos: number) {
    const user = await this.findUserById(userId);

    const updatedAlgos = user.awardedAlgos + algos;

    const updatedUser = await this.userRepo
      .findByIdAndUpdate(
        userId,
        {
          awardedAlgos: updatedAlgos,
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Unable to update the user');
    }

    return { success: true, message: 'Algos awarded successfully.' };
  }

  async uploadProfileImage(userId: string, data: UploadImageDto) {
    const { base64 } = data;

    await this.findUserById(userId);
    try {
      const imageUrl = await this.imageUpload(base64);

      if (!imageUrl) {
        throw new InternalServerErrorException('Image upload failed.');
      }

      const updatedUser = await this.userRepo
        .findByIdAndUpdate(
          userId,
          {
            image: imageUrl,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('Unable to update the user');
      }

      return {
        message: 'User image was updated successfully',
      };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new InternalServerErrorException('Failed to upload profile image.');
    }
  }

  async imageUpload(base64: string): Promise<string> {
    try {
      const imageData = await this.fileUploadService.uploadProfilePhoto(
        '',
        base64,
      );

      if (!imageData || !imageData.imageUrl) {
        throw new Error('Invalid image data received.');
      }

      return imageData.imageUrl;
    } catch (error) {
      console.error('Error during image upload:', error);
      throw new InternalServerErrorException(
        'Failed to upload image to Cloudinary.',
      );
    }
  }
}
