import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProposalDocument = HydratedDocument<Proposal>;

@Schema()
export class Proposal {
  @Prop()
  appId: string;

  @Prop({ required: false })
  asaId?: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  startDate: number;

  @Prop()
  endDate: number;

  @Prop()
  creator: string;

  @Prop([String])
  registeredVoters: string[];

  @Prop([String])
  yesVotes: string[];

  @Prop([String])
  noVotes: string[];

  @Prop({ default: true })
  ongoing: boolean;
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);
