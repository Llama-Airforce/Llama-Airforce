import { ServiceBase } from "@/Services";
import { getHost } from "@/Services/Host";
import AuraService from "@LAF/Pages/Bribes/Services/AuraService";
import { getMergeWithHiddenHands } from "@LAF/Pages/Bribes/Util/AuraHelper";
import type { OverviewId, OverviewResponse } from "@LAF/Pages/Bribes/Models";

const auraService = new AuraService(getHost());

export default class DashboardService extends ServiceBase {
  public async getOverview(overviewId: OverviewId): Promise<OverviewResponse> {
    const request = this.fetch<OverviewResponse>(`${this.host}/dashboard`, {
      id: overviewId,
    });

    if (overviewId === "bribes-overview-aura") {
      const [baseResponse, newResponse] = await Promise.all([
        request,
        auraService.getOverview(),
      ]);

      return getMergeWithHiddenHands(baseResponse, newResponse);
    }

    return request;
  }
}
