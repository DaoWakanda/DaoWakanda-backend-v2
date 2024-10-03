import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from 'libs/schema/proposal.schema';
import {
  AssetWhiteListSchema,
  AssetWhitelist,
} from 'libs/schema/asset-whitelist.schema';
import { AlgorandService } from 'modules/algorand/algorand.service';

@Module({
  providers: [ProposalService, AlgorandService],
  imports: [
    MongooseModule.forFeature([
      { name: Proposal.name, schema: ProposalSchema },
      { name: AssetWhitelist.name, schema: AssetWhiteListSchema },
    ]),
  ],
  exports: [ProposalService],
})
export class ProposalModule {}
