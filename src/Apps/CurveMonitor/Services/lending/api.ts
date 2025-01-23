import { fetchType as fetch } from "@/Services";
import type { Chain } from "@/Types/Chain";
import { getHost, type Options } from "..";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

export type Endpoint = "crvusd" | "lending";

export async function getLoanDistribution(
  endpoint: Endpoint,
  chain: Chain,
  controller: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetLoanDistributionResponse>(
    `${host}/v1/${endpoint}/markets/${chain}/${controller}/loans/distribution`
  );

  return Parsers.parseLoanDistribution(resp);
}
