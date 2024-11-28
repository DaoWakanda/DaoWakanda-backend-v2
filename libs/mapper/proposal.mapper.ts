import { ProposalDto } from 'libs/dto';
import { Proposal } from 'libs/schema/proposal.schema';

export const toProposal = (proposal: Proposal): ProposalDto => {
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
};
