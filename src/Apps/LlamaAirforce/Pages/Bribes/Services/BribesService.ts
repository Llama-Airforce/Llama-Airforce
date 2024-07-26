import { ServiceBaseHost } from "@/Services";
import type { EpochId, EpochOverview, Product } from "@LAF/Pages/Bribes/Models";
import { type Result as RoundsResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/rounds.get";
import { type Result as EpochResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/[round].get";

export default class BribesService extends ServiceBaseHost {
  public async rounds(product: Partial<Product>): Promise<RoundsResponse> {
    const host = await this.getHost();

    return this.fetch(
      `${host}/bribes/${product.platform}/${product.protocol}/rounds`
    );
  }

  public async getEpoch(epochId: EpochId): Promise<EpochResponse> {
    const host = await this.getHost();

    const round = epochId.round?.toString();
    let url = `${host}/bribes/${epochId.platform}/${epochId.protocol}`;
    if (round) {
      url += `/${round}`;
    }

    return this.fetch(url);
  }

  public async getOverview(): Promise<{
    epochs: EpochOverview[];
  }> {
    const host = await this.getHost();

    return this.fetch(`${host}/bribes/overview`);
  }
}
