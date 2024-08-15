import { ServiceBase } from "@/Services";
import { type Chain } from "@CM/Models";
import type * as ApiTypes from "@CM/Services/Lending/ApiTypes";
import * as Parsers from "@CM/Services/Lending/Parsers";

const API_URL = "https://prices.curve.fi";

export type Endpoint = "crvusd" | "lending";

export default class LendingService extends ServiceBase {
  public async getLoanDistribution(
    endpoint: Endpoint,
    chain: Chain,
    controller: string
  ) {
    const resp = await this.fetch<ApiTypes.GetLoanDistributionResponse>(
      `${API_URL}/v1/${endpoint}/markets/${chain}/${controller}/loans/distribution`
    );

    return Parsers.parseLoanDistribution(resp);
  }
}
