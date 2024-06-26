import type { Epoch, EpochId } from "@LAF/Pages/Bribes/Models";
import BribesService from "@LAF/Pages/Bribes/Services/BribesService";
import AuraService from "@LAF/Pages/Bribes/Services/AuraService";
import { AuraConstants } from "@LAF/Pages/Bribes/Util/AuraHelper";

export default class AuraBribesService extends BribesService {
  private auraService: AuraService;

  constructor(host: string) {
    super(host);
    this.auraService = new AuraService(host);
  }

  override async rounds(): Promise<{
    rounds: number[];
  }> {
    return Promise.resolve({
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
    return this.fetch(`${this.host}/bribes`, {
      platform: epochId.platform,
      protocol: epochId.protocol,
      round: epochId.round?.toString(),
    });
  }
}
