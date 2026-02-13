import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from 'libs/schema/proposal.schema';
import {
  AssetWhiteListSchema,
  AssetWhitelist,
} from 'libs/schema/asset-whitelist.schema';
import { User, UserSchema } from 'libs/schema/user.schema';
import { AlgorandService } from 'modules/algorand/algorand.service';
import {
  ProposalGroup,
  ProposalroupSchema,
} from '../../libs/schema/proposal-group.schema';

@Module({
  providers: [ProposalService, AlgorandService],
  imports: [
    MongooseModule.forFeature([
      { name: Proposal.name, schema: ProposalSchema },
      { name: AssetWhitelist.name, schema: AssetWhiteListSchema },
      { name: ProposalGroup.name, schema: ProposalroupSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [ProposalService],
})
export class ProposalModule {}
