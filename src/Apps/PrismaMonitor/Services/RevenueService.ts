import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api.prismamonitor.com/v1";

export type Snapshot = {
  unlock_penalty_revenue_usd: number;
  borrowing_fees_revenue_usd: number;
  redemption_fees_revenue_usd: number;
  timestamp: number;
};

export type Breakdown = {
  unlock_penalty: number;
  borrowing_fees: number;
  redemption_fees: number;
};

export default class RevenueService extends ServiceBase {
  public async getSnapshots(): Promise<{
    snapshots: Snapshot[];
  }> {
    return this.fetch(`${API_URL}/revenue/ethereum/snapshots?period=3m`);
  }

  public async getBreakdown(): Promise<Breakdown> {
    return this.fetch(`${API_URL}/revenue/ethereum/breakdown`);
  }
}
