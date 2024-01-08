import BribesService from "@/Apps/LlamaAirforce/Pages/Bribes/Services/BribesService";
import { AuraConstants } from "@/Apps/LlamaAirforce/Pages/Bribes/Util/AuraHelper";
import AuraService from "@/Services/AuraService";
import { getHost } from "@/Services/Host";
import type { Epoch, EpochId } from "@LAF/Pages/Bribes/Models";

const auraService = new AuraService(getHost());

export default class AuraBribesService extends BribesService {
  override async rounds(): Promise<{
    rounds: number[];
  }> {
    return Promise.resolve({
      rounds: [...new Array(auraService.latestRound)].map((_, i) => i + 1),
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
      return auraService.getRound(epochId.round);
    }
    // Else, fallback to Llama
    return this.fetch(`${this.host}/bribes`, {
      platform: epochId.platform,
      protocol: epochId.protocol,
      round: epochId.round?.toString(),
    });
  }
}
