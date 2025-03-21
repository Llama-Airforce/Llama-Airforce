import type { EpochId } from "@LAF/Pages/Bribes/Models";
import AuraService from "@LAF/Pages/Bribes/Services/AuraService";
import BribesService from "@LAF/Pages/Bribes/Services/BribesService";
import { AuraConstants } from "@LAF/Pages/Bribes/Util/AuraHelper";
import type { Result as EpochResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/[round].get";
import type { Result as RoundsResponse } from "@LAF/Server/routes/bribes/[platform]/[protocol]/rounds.get";

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

  override async getEpoch(epochId: EpochId): Promise<EpochResponse> {
    // If epoch greater than cutoff, load from HH
    if (epochId.round >= AuraConstants.START_ROUND) {
      return this.auraService.getRound(epochId.round);
    }

    // Else, fallback to Llama
    const host = await this.getHost();

    const round = epochId.round.toString();

    return this.fetch(
      `${host}/bribes/${epochId.platform}/${epochId.protocol}/${round}`
    );
  }
}
