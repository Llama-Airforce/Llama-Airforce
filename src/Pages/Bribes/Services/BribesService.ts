import type { Epoch } from "@/Pages/Bribes/Models/Epoch";
import type { EpochId } from "@/Pages/Bribes/Models/EpochId";
import type { EpochOverview } from "@/Pages/Bribes/Models/EpochOverview";
import type { Product } from "@/Pages/Bribes/Models/Product";
import ServiceBase from "@/Services/ServiceBase";

export class RoundsResponse {
  rounds: number[];
}

export class EpochResponse {
  success: boolean;
  epoch?: Epoch;
}

export class EpochOverviewResponse {
  epochs: EpochOverview[];
}

export default class BribesService extends ServiceBase {
  public async rounds(product: Partial<Product>): Promise<RoundsResponse> {
    return this.fetch(`${this.host}/bribes/rounds`, RoundsResponse, {
      platform: product.platform,
      protocol: product.protocol,
    });
  }

  public async getEpoch(
    epochId: Omit<EpochId, "round"> & { round?: number } // Round is optional, picks latest if empty.
  ): Promise<EpochResponse> {
    return this.fetch(`${this.host}/bribes`, EpochResponse, {
      platform: epochId.platform,
      protocol: epochId.protocol,
      round: epochId.round?.toString(),
    });
  }

  public async getOverview(): Promise<EpochOverviewResponse> {
    return this.fetch(`${this.host}/bribes/overview`, EpochOverviewResponse);
  }
}
