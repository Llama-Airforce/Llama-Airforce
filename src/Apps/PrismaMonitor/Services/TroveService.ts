import { paginate } from "@/Util";
import { ServiceBase } from "@/Services";
import { type Flavor, apiUrl } from "@PM/Models/Flavor";

export type TroveStatus = "Open" | "Closed";
export type Trove = {
  owner: string;
  status: TroveStatus;
  collateral_usd: number;
  debt: number;
  collateral_ratio: number;
  created_at: number;
  last_update: number;
};

export type TroveSnapshotData = {
  operation: string;
  collateral: number;
  collateral_usd: number;
  cr: number | null;
  debt: number;
  stake: number;
  block: number;
  timestamp: number;
  hash: string;
};

export type TroveHistoryData = {
  collateral: number;
  collateral_usd: number;
  cr: number | null;
  debt: number;
  timestamp: number;
};

export type Position = {
  ratio: number;
  collateral_usd: number;
  trove_count: number;
};

export type RatioPosition = {
  rank: number | null;
  total_positions: number;
  ratio: number | null;
  positions: Position[];
};

export default class TroveService extends ServiceBase {
  private readonly API_URL: string;

  constructor(host: string, flavor: Flavor) {
    super(host);
    this.API_URL = apiUrl(flavor);
  }

  public async getTroves(
    chain: string,
    manager: string,
    owner?: string
  ): Promise<Trove[]> {
    const fs = (page: number) => {
      return this.fetch<{
        page: number;
        total_entries: number;
        troves: Trove[];
      }>(
        `${
          this.API_URL
        }/trove/${chain}/${manager}/troves?items=100&page=${page}&order_by=last_update&desc=true${
          owner ? "&owner_filter=" + owner : ""
        }`
      ).then((resp) => resp.troves);
    };

    return paginate(fs, 1, 100);
  }

  public async getTroveSnapshots(
    chain: string,
    manager: string,
    owner: string
  ): Promise<{ snapshots: TroveSnapshotData[] }> {
    return this.fetch(
      `${this.API_URL}/trove/${chain}/${manager}/snapshots/${owner}`
    );
  }

  public async getTroveDetail(
    chain: string,
    manager: string,
    owner: string
  ): Promise<Trove> {
    return this.fetch(`${this.API_URL}/trove/${chain}/${manager}/${owner}`);
  }

  public async getTroveHistory(
    chain: string,
    manager: string,
    owner: string
  ): Promise<{ snapshots: TroveHistoryData[] }> {
    return this.fetch(
      `${this.API_URL}/trove/${chain}/${manager}/history/${owner}`
    );
  }

  public async getTroveRank(
    chain: string,
    manager: string,
    owner: string
  ): Promise<RatioPosition> {
    return this.fetch(
      `${this.API_URL}/trove/${chain}/${manager}/rank/${owner}`
    );
  }
}
