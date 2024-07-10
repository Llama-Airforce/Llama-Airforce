import { ServiceBaseHost } from "@/Services";
import type { DashboardResponse } from "@LAF/Pages/Bribes/Models";

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

export default class FlyerService extends ServiceBaseHost {
  public async getConvex(): Promise<DashboardResponse<FlyerConvex>> {
    const id: FlyerId = "flyer-convex";
    const host = await this.getHost();

    return this.fetch(`${host}/dashboard/${id}`);
  }

  public async getAura(): Promise<DashboardResponse<FlyerAura>> {
    const id: FlyerId = "flyer-aura";
    const host = await this.getHost();

    return this.fetch(`${host}/dashboard/${id}`);
  }
}
