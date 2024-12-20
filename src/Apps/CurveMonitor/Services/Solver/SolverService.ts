import type { Address } from "@/Types/Address";
import { ServiceBase } from "@/Services";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL = "https://api.cow.fi";

export default class SolverService extends ServiceBase {
  public async getCompetition(tx: Address) {
    const resp = await this.fetch<ApiTypes.GetSolverCompetitionResponse>(
      `${API_URL}/mainnet/api/v1/solver_competition/by_tx_hash/${tx}`
    );

    return Parsers.parseSolverCompetition(resp);
  }
}
