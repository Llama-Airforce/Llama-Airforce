import { ServiceBaseHost } from "@/Services";
import AuraService from "@LAF/Pages/Bribes/Services/AuraService";
import { getMergeWithHiddenHands } from "@LAF/Pages/Bribes/Util/AuraHelper";
import type { OverviewId, OverviewResponse } from "@LAF/Pages/Bribes/Models";

export default class DashboardService extends ServiceBaseHost {
  private auraService: AuraService;

  constructor(host: Promise<string>) {
    super(host);
    this.auraService = new AuraService();
  }

  public async getOverview(overviewId: OverviewId): Promise<OverviewResponse> {
    const host = await this.getHost();

    const request = this.fetch<OverviewResponse>(
      `${host}/dashboard/overview/${overviewId}`
    );

    if (overviewId === "bribes-overview-aura") {
      const [baseResponse, newResponse] = await Promise.all([
        request,
        this.auraService.getOverview(),
      ]);

      return getMergeWithHiddenHands(baseResponse, newResponse);
    }

    return request;
  }
}
