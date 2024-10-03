import { Injectable, Logger } from '@nestjs/common';
import { Algodv2 } from 'algosdk';
import { env } from 'libs/utils/env';

@Injectable()
export class AlgorandService {
  algodClient: Algodv2;
  private readonly logger = new Logger(AlgorandService.name);

  constructor() {
    const baseServer = env.ALGOD_SERVER;
    const token = {
      'X-API-Key': env.ALGOD_TOKEN,
    };
    this.algodClient = new Algodv2(token, baseServer, '');
  }

  async validateWalletAddress(address: string): Promise<boolean> {
    try {
      const res = await this.algodClient.accountInformation(address).do();
      this.logger.log('Account info', res);
      return true;
    } catch (e) {
      this.logger.error('Error validating address', e);
      return false;
    }
  }

  async checkIfAccountHasAsset(
    address: string,
    assetId: string
  ): Promise<boolean> {
    try {
      const res = await this.algodClient
        .accountAssetInformation(address, Number(assetId))
        .do();
      this.logger.log('Account asset info', res);
      return res.assetHolding.amount > 0;
    } catch (e) {
      this.logger.error(`Error validating address for assetId: ${assetId}`, e);
      return false;
    }
  }

  async checkIfAssetExists(assetId: string): Promise<boolean> {
    try {
      const res = await this.algodClient.getAssetByID(Number(assetId)).do();
      this.logger.log('Asset info', res);
      return !!res;
    } catch (e) {
      this.logger.error(`Error validating asset with assetId: ${assetId}`, e);
      return false;
    }
  }
}
