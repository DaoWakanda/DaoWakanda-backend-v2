import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssetWhitelistDocument = HydratedDocument<AssetWhitelist>;

@Schema()
export class AssetWhitelist {
  @Prop()
  assetId: string;
}

export const AssetWhiteListSchema =
  SchemaFactory.createForClass(AssetWhitelist);
