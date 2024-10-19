import { UserResponseDto } from 'libs/dto';
import { LeaderboardResponseDto } from 'libs/dto/trivia.dto';
import { IdObject } from 'libs/interfaces';
import { User } from 'libs/schema/user.schema';

export const toUserResponse = (user: User & IdObject): UserResponseDto => {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: user.image,
    country: user.country,
    stateOfResidence: user.stateOfResidence,
    githubLink: user.githubLink,
    walletAddress: user.walletAddress,
    awardedAlgos: user.awardedAlgos,
  };
};

export const toLeaderBoard = (user: User): LeaderboardResponseDto => {
  return {
    name: `${user.firstName} ${user.lastName}`,
    totalAlgos: user.awardedAlgos,
  };
};
