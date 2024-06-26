import { paginate } from "@/Util";
import { ServiceBase } from "@/Services";
import { type Vault } from "@PM/Models/Vault";
import { type Flavor, apiUrl } from "@PM/Models/Flavor";

export type Liquidation = {
  liquidator: string;
  vault: Vault;
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
  private readonly API_URL: string;

  constructor(flavor: Flavor) {
    super();
    this.API_URL = apiUrl(flavor);
  }

  public async getLiquidations(
    chain: string,
    manager: string
  ): Promise<Liquidation[]> {
    const fs = (page: number) => {
      return this.fetch<{
        liquidations: Liquidation[];
      }>(
        `${this.API_URL}/liquidations/${chain}/${manager}?items=100&page=${page}&order_by=block_timestamp&desc=true`
      ).then((resp) =>
        resp.liquidations.map((l) => ({
          ...l,
          liquidator: l.liquidator.toLocaleLowerCase(),
          vault: l.vault.toLocaleLowerCase() as Vault,
        }))
      );
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
        `${this.API_URL}/liquidations/${chain}?items=100&page=${page}&order_by=block_timestamp&desc=true&trove_filter=${trove}`
      ).then((resp) =>
        resp.liquidations.map((l) => ({
          ...l,
          liquidator: l.liquidator.toLocaleLowerCase(),
          vault: l.vault.toLocaleLowerCase() as Vault,
        }))
      );
    };

    return paginate(fs, 1, 100);
  }
}
