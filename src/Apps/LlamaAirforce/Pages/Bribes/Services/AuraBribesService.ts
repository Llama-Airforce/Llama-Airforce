import type { Epoch, EpochId } from "@LAF/Pages/Bribes/Models";
import BribesService from "@LAF/Pages/Bribes/Services/BribesService";
import AuraService from "@LAF/Pages/Bribes/Services/AuraService";
import { AuraConstants } from "@LAF/Pages/Bribes/Util/AuraHelper";
import { type Result as RoundsResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/rounds.get";

export default class AuraBribesService extends BribesService {
  private auraService: AuraService;

  constructor(host: Promise<string>) {
    super(host);
    this.auraService = new AuraService();
  }

  override async rounds(): Promise<RoundsResponse> {
    return Promise.resolve({
      statusCode: 200,
      rounds: [...new Array<number>(this.auraService.latestRound)].map(
        (_, i) => i + 1
      ),
    });
  }

  override async getEpoch(
    epochId: Omit<EpochId, "round"> & { round?: number } // Round is optional, picks latest if empty.
  ): Promise<{
    success: boolean;
    epoch?: Epoch;
  }> {
    // If epoch greater than cutoff, load from HH
    if ((epochId?.round ?? Number.MAX_VALUE) >= AuraConstants.START_ROUND) {
      return this.auraService.getRound(epochId.round);
    }

    // Else, fallback to Llama
    const host = await this.getHost();

    return this.fetch(`${host}/bribes`, {
      platform: epochId.platform,
      protocol: epochId.protocol,
      round: epochId.round?.toString(),
    });
  }
}
