import { paginate } from "@/Util";
import { ServiceBase } from "@/Services";

const API_URL = "https://api.prismamonitor.com/v1";

export type Redemption = {
  redeemer: string;
  vault: string;
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
  public async getRedemptions(
    chain: string,
    manager: string
  ): Promise<Redemption[]> {
    const fs = (page: number) => {
      return this.fetch<{
        redemptions: Redemption[];
      }>(
        `${API_URL}/redemptions/${chain}/${manager}?items=100&page=${page}&order_by=block_timestamp&desc=true`
      ).then((resp) => resp.redemptions);
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
        `${API_URL}/redemptions/${chain}?items=100&page=${page}&order_by=block_timestamp&desc=true&trove_filter=${trove}`
      ).then((resp) => resp.redemptions);
    };

    return paginate(fs, 1, 100);
  }
}
