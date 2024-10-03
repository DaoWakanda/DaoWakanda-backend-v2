import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BootstrapProposalDto,
  CreateProposalDto,
  ProposalDto,
  ValidateAddressResDto,
  VoteProposalDto,
} from 'libs/dto';
import {
  AssetWhitelist,
  AssetWhitelistDocument,
} from 'libs/schema/asset-whitelist.schema';
import { Proposal, ProposalDocument } from 'libs/schema/proposal.schema';
import { AlgorandService } from 'modules/algorand/algorand.service';
import { Model } from 'mongoose';

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel(Proposal.name) private proposalModel: Model<ProposalDocument>,
    @InjectModel(AssetWhitelist.name)
    private assetWhitelistModel: Model<AssetWhitelistDocument>,
    private readonly algorandService: AlgorandService
  ) {}

  async addAssetToWhitelist(assetId: string) {
    const existingAsset = await this.assetWhitelistModel.findOne({ assetId });

    if (existingAsset) {
      throw new ForbiddenException('This asset has already been whitelisted');
    }

    const assetExists = await this.algorandService.checkIfAssetExists(assetId);

    if (!assetExists) {
      throw new ForbiddenException(`No asset with asset id ${assetId} exists`);
    }

    const asset = new this.assetWhitelistModel({
      assetId,
    });

    await asset.save();
    return this.getAllWhitelist();
  }

  async removeAssetFromWhitelist(assetId: string) {
    const existingAsset = await this.assetWhitelistModel.findOne({ assetId });

    if (!existingAsset) {
      throw new ForbiddenException(
        'No asset with the given ID exists in the whitelist.'
      );
    }

    await this.assetWhitelistModel.deleteOne({ assetId });

    return this.getAllWhitelist();
  }

  async getAllWhitelist() {
    const data = await this.assetWhitelistModel.find({});

    const flattenedData = data.map((whitelist) => whitelist.assetId);
    const set = new Set(flattenedData);

    return Array.from(set);
  }

  async batchUploadAssetsToWhiteList(assetIds: string[]) {
    for (const assetId of assetIds) {
      const assetExists =
        await this.algorandService.checkIfAssetExists(assetId);

      if (!assetExists) {
        throw new ForbiddenException(
          `No asset with asset id ${assetId} exists`
        );
      }
    }

    const existingAssetIds = await this.getAllWhitelist();
    const assetIdsToUpload = assetIds.filter(
      (asset) => !existingAssetIds.includes(asset)
    );
    const assets = Array.from(new Set(assetIdsToUpload)).map((asset) => ({
      assetId: asset,
    }));

    await this.assetWhitelistModel.insertMany(assets);

    return this.getAllWhitelist();
  }

  async batchDeleteAssetsFromWhiteList(assetIds: string[]) {
    const existingAssetIds = await this.getAllWhitelist();
    const assetIdsToDelete = assetIds.filter((asset) =>
      existingAssetIds.includes(asset)
    );
    await this.assetWhitelistModel.deleteMany({
      assetId: { $in: assetIdsToDelete },
    });

    return this.getAllWhitelist();
  }

  async getProposalByAppId(appId: string): Promise<ProposalDto> {
    const proposal = await this.proposalModel.findOne({ appId });

    if (!proposal) {
      throw new NotFoundException(
        'No proposal with the provided App ID exists'
      );
    }

    return {
      appId: proposal.appId,
      asaId: proposal.asaId,
      ongoing: proposal.ongoing,
      registeredVoters: proposal.registeredVoters,
      yesVotes: proposal.yesVotes,
      noVotes: proposal.noVotes,
      creator: proposal.creator,
      title: proposal.title,
      description: proposal.description,
      startDate: proposal.startDate,
      endDate: proposal.endDate,
    };
  }

  async getAllProposals(): Promise<ProposalDto[]> {
    const proposals = await this.proposalModel.find({});

    return proposals.map((proposal) => ({
      appId: proposal.appId,
      asaId: proposal.asaId,
      ongoing: proposal.ongoing,
      registeredVoters: proposal.registeredVoters,
      yesVotes: proposal.yesVotes,
      noVotes: proposal.noVotes,
      creator: proposal.creator,
      title: proposal.title,
      description: proposal.description,
      startDate: proposal.startDate,
      endDate: proposal.endDate,
    }));
  }

  async createProposal(dto: CreateProposalDto) {
    const existingProposal = await this.proposalModel.findOne({
      appId: dto.appId,
    });

    if (existingProposal) {
      throw new ConflictException(
        'A proposal with the provided App ID exists already'
      );
    }

    const creatorIsValidAlgorandAddress =
      await this.algorandService.validateWalletAddress(dto.creator);

    if (!creatorIsValidAlgorandAddress) {
      throw new ForbiddenException('Creator is not a valid algorand address.');
    }

    const proposal = new this.proposalModel({
      ...dto,
      registeredVoters: [],
      ongoing: true,
      yesVotes: [],
      noVotes: [],
    });
    await proposal.save();

    return this.getProposalByAppId(dto.appId);
  }

  async bootstrapProposal(appId: string, dto: BootstrapProposalDto) {
    const proposal = await this.getProposalByAppId(appId);

    if (proposal.asaId) {
      throw new ConflictException('This proposal has been boostrapped already');
    }

    await this.proposalModel.findOneAndUpdate({ appId }, { asaId: dto.asaId });

    return this.getProposalByAppId(appId);
  }

  async voteForProposal(appId: string, dto: VoteProposalDto) {
    const proposal = await this.getProposalByAppId(appId);

    if (!proposal.ongoing) {
      throw new ForbiddenException(
        'This proposal is no longer open for voting'
      );
    }

    if (
      proposal.yesVotes.includes(dto.voterAddress) ||
      proposal.noVotes.includes(dto.voterAddress)
    ) {
      throw new ForbiddenException('This voter has already voted');
    }

    const voters = dto.vote ? proposal.yesVotes : proposal.noVotes;
    voters.push(dto.voterAddress);

    await this.proposalModel.findOneAndUpdate(
      { appId },
      {
        $set: { [dto.vote ? 'yesVotes' : 'noVotes']: voters },
        $push: { registeredVoters: dto.voterAddress },
      }
    );

    return this.getProposalByAppId(appId);
  }

  async deleteProposal(appId: string) {
    await this.getProposalByAppId(appId);

    await this.proposalModel.deleteOne({ appId });

    return this.getAllProposals();
  }

  async validateAddress(address: string): Promise<ValidateAddressResDto> {
    const assetIds = await this.getAllWhitelist();

    for (const assetId of assetIds) {
      const isValid = await this.algorandService.checkIfAccountHasAsset(
        address,
        assetId
      );

      if (isValid) {
        return { valid: true, address, assetId };
      }
    }

    throw new ForbiddenException(
      'Your address cannot create or vote in a Proposal on DaoWakanda'
    );
  }
}
