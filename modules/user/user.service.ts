import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from 'libs/dto';
import { User } from 'libs/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userRepo: Model<User>) {}

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
      createdUser: {
        id: savedUser._id.toString(),
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        image: savedUser.image,
        country: savedUser.country,
        stateOfResidence: savedUser.stateOfResidence,
        walletAddress: savedUser.walletAddress,
      },
    };
  }

  async findUserByWalletAddress(address: string) {
    const user = await this.userRepo
      .findOne({ walletAddress: address })
      .lean()
      .exec();

    if (user) {
      return {
        ...user,
        id: user._id.toString(),
        _id: undefined,
      };
    }

    return null;
  }

  async updateUser(address: string, data: UpdateUserDto) {
    const user = await this.findUserByWalletAddress(address);

    if (!user)
      throw new NotFoundException(
        'No user found with that wallet address exists',
      );

    const updatedUser = await this.userRepo.findByIdAndUpdate(
      user.id,
      {
        ...data,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('Unable to update the user');
    }

    return {
      message: 'User updated successfully',
      updatedUser: {
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        image: updatedUser.image,
        country: updatedUser.country,
        stateOfResidence: updatedUser.stateOfResidence,
        walletAddress: updatedUser.walletAddress,
      },
    };
  }
}
