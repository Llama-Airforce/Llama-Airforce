import { ServiceBaseHost } from "@/Services";
import type {
  Epoch,
  EpochId,
  EpochOverview,
  Product,
} from "@LAF/Pages/Bribes/Models";
import { type Result as RoundsResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/rounds.get";

export const API_URL = "https://api-next.llama.airforce";

export default class BribesService extends ServiceBaseHost {
  public async rounds(product: Partial<Product>): Promise<RoundsResponse> {
    const host = await this.getHost();

    return this.fetch(
      `${host}/bribes/${product.platform}/${product.protocol}/rounds`
    );
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
