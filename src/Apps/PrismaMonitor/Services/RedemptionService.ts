import { paginate } from "@/Utils/Pagination";
import { ServiceBase } from "@/Services";
import type { Vault } from "@PM/Models/Vault";
import { type Flavor, apiUrl } from "@PM/Models/Flavor";

export type Redemption = {
  redeemer: string;
  vault: Vault;
  attempted_debt_amount: number;
  actual_debt_amount: number;
  collateral_sent: number;
  collateral_sent_usd: number;
  collateral_sent_to_redeemer: number;
  collateral_sent_to_redeemer_usd: number;
  collateral_fee: number;
  collateral_fee_usd: number;
  troves_affected: string[];
  troves_affected_count: number;
  transaction: string;
  timestamp: number;
};

export default class RedemptionService extends ServiceBase {
  private readonly API_URL: string;

  constructor(flavor: Flavor) {
    super();
    this.API_URL = apiUrl(flavor);
  }

  public async getRedemptions(
    chain: string,
    manager: string
  ): Promise<Redemption[]> {
    const fs = (page: number) => {
      return this.fetch<{
        redemptions: Redemption[];
      }>(
        `${this.API_URL}/redemptions/${chain}/${manager}?items=100&page=${page}&order_by=block_timestamp&desc=true`
      ).then((resp) =>
        resp.redemptions.map((r) => ({
          ...r,
          redeemer: r.redeemer.toLocaleLowerCase(),
          vault: r.vault.toLocaleLowerCase() as Vault,
        }))
      );
    };

    return paginate(fs, 1, 100);
  }

  public async getRedemptionsForTrove(
    chain: string,
    trove: string
  ): Promise<Redemption[]> {
    const fs = (page: number) => {
      return this.fetch<{
        redemptions: Redemption[];
      }>(
        `${this.API_URL}/redemptions/${chain}?items=100&page=${page}&order_by=block_timestamp&desc=true&trove_filter=${trove}`
      ).then((resp) =>
        resp.redemptions.map((r) => ({
          ...r,
          redeemer: r.redeemer.toLocaleLowerCase(),
          vault: r.vault.toLocaleLowerCase() as Vault,
        }))
      );
    };

    return paginate(fs, 1, 100);
  }
}
