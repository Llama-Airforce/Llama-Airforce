import { paginate } from "@/Util";
import { ServiceBase } from "@/Services";

const API_URL = "https://api.prismamonitor.com/v1";

export type Liquidation = {
  liquidator: string;
  vault: string;
  liquidated_debt: number;
  liquidated_collateral: number;
  liquidated_collateral_usd: number;
  collateral_gas_compensation: number;
  collateral_gas_compensation_usd: number;
  debt_gas_compensation: number;
  troves_affected: string[];
  troves_affected_count: number;
  transaction: string;
  timestamp: number;
};

export default class LiquidationService extends ServiceBase {
  public async getLiquidations(
    chain: string,
    manager: string
  ): Promise<Liquidation[]> {
    const fs = (page: number) => {
      return this.fetch<{
        liquidations: Liquidation[];
      }>(
        `${API_URL}/liquidations/${chain}/${manager}?items=100&page=${page}&order_by=block_timestamp&desc=true`
      ).then((resp) => resp.liquidations);
    };

    return paginate(fs, 1, 100);
  }

  public async getLiquidationsForTrove(
    chain: string,
    trove: string
  ): Promise<Liquidation[]> {
    const fs = (page: number) => {
      return this.fetch<{
        liquidations: Liquidation[];
      }>(
        `${API_URL}/liquidations/${chain}?items=100&page=${page}&order_by=block_timestamp&desc=true&trove_filter=${trove}`
      ).then((resp) => resp.liquidations);
    };

    return paginate(fs, 1, 100);
  }
}
