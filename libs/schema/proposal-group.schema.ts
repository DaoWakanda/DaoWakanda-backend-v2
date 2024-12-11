import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProposalGroupDocument = HydratedDocument<ProposalGroup>;

@Schema()
export class ProposalGroup {
  @Prop({
    default: {},
    type: Object,
  })
  group: Record<string, boolean>;
}

export const ProposalroupSchema = SchemaFactory.createForClass(ProposalGroup);
