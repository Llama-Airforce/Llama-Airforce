import { fetchType as fetch } from "@/Services";
import { getHost, type Options } from "..";
import type { Address } from "@/Types/Address";
import type * as Responses from "./responses";
import * as Parsers from "./parsers";

export async function getCompetition(tx: Address, options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetSolverCompetitionResponse>(
    `${host}/mainnet/api/v1/solver_competition/by_tx_hash/${tx}`
  );

  return Parsers.parseSolverCompetition(resp);
}
