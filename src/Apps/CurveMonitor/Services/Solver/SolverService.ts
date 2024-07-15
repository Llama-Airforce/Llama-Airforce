import { type Address } from "viem";
import { ServiceBase } from "@/Services";
import type * as ApiTypes from "@CM/Services/Solver/ApiTypes";
import * as Parsers from "@CM/Services/Solver/Parsers";

const API_URL = "https://api.cow.fi";

export default class SolverService extends ServiceBase {
  public async getCompetition(tx: Address) {
    const resp = await this.fetch<ApiTypes.GetSolverCompetitionResponse>(
      `${API_URL}/mainnet/api/v1/solver_competition/by_tx_hash/${tx}`
    );

    return Parsers.parseSolverCompetition(resp);
  }
}
