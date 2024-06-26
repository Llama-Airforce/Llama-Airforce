import { ServiceBase } from "@/Services";
import AuraService from "@LAF/Pages/Bribes/Services/AuraService";
import { getMergeWithHiddenHands } from "@LAF/Pages/Bribes/Util/AuraHelper";
import type { OverviewId, OverviewResponse } from "@LAF/Pages/Bribes/Models";

export default class DashboardService extends ServiceBase {
  private auraService: AuraService;

  constructor(host: string) {
    super(host);
    this.auraService = new AuraService(host);
  }

  public async getOverview(overviewId: OverviewId): Promise<OverviewResponse> {
    const request = this.fetch<OverviewResponse>(`${this.host}/dashboard`, {
      id: overviewId,
    });

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
