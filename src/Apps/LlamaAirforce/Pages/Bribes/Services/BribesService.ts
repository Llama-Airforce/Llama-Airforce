import { ServiceBaseHost } from "@/Services";
import type { EpochId, EpochOverview, Product } from "@LAF/Pages/Bribes/Models";
import { type Result as RoundsResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/rounds.get";
import { type Result as EpochResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/[round].get";

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
  ): Promise<EpochResponse> {
    const host = await this.getHost();

    const round = epochId.round?.toString();

    return this.fetch(
      `${host}/bribes/${epochId.platform}/${epochId.protocol}/${round}`
    );
  }

  public async getOverview(): Promise<{
    epochs: EpochOverview[];
  }> {
    const host = await this.getHost();

    return this.fetch(`${host}/bribes/overview`);
  }
}
