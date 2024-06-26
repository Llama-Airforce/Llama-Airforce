import { ServiceBaseHost } from "@/Services";
import type {
  Epoch,
  EpochId,
  EpochOverview,
  Product,
} from "@LAF/Pages/Bribes/Models";

export default class BribesService extends ServiceBaseHost {
  public async rounds(product: Partial<Product>): Promise<{
    rounds: number[];
  }> {
    const host = await this.getHost();

    return this.fetch(`${host}/bribes/rounds`, {
      platform: product.platform,
      protocol: product.protocol,
    });
  }

  public async getEpoch(
    epochId: Omit<EpochId, "round"> & { round?: number } // Round is optional, picks latest if empty.
  ): Promise<{
    success: boolean;
    epoch?: Epoch;
  }> {
    const host = await this.getHost();

    return this.fetch(`${host}/bribes`, {
      platform: epochId.platform,
      protocol: epochId.protocol,
      round: epochId.round?.toString(),
    });
  }

  public async getOverview(): Promise<{
    epochs: EpochOverview[];
  }> {
    const host = await this.getHost();

    return this.fetch(`${host}/bribes/overview`);
  }
}
