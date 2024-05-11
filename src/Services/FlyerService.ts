import { ServiceBase } from "@/Services";

type FlyerId = "flyer-convex" | "flyer-aura";

export type FlyerConvex = {
  revenueMonthly: number;
  revenueAnnually: number;

  crvLockedDollars: number;
  crvLockedDollarsMonthly: number;
  cvxTvl: number;
  cvxVotingPercentage: number;
  cvxMarketCap: number;
  cvxMarketCapFullyDiluted: number;

  bribesIncomeAnnually: number;
  bribesIncomeBiWeekly: number;

  cvxApr: number;
  cvxCrvApr: number;
};

export type FlyerAura = {
  auraBalPrice: number;
  auraBalApr: number;
};

export default class FlyerService extends ServiceBase {
  public async getConvex(): Promise<{
    success: boolean;
    dashboard?: FlyerConvex;
  }> {
    const id: FlyerId = "flyer-convex";

    return this.fetch(`${this.host}/dashboard`, {
      id,
    });
  }

  public async getAura(): Promise<{
    success: boolean;
    dashboard?: FlyerAura;
  }> {
    const id: FlyerId = "flyer-aura";

    return this.fetch(`${this.host}/dashboard`, {
      id,
    });
  }
}
