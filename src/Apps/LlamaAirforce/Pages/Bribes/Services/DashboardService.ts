import { getMergeWithHiddenHands } from "@/Apps/LlamaAirforce/Pages/Bribes/Util/AuraHelper";
import { ServiceBase } from "@/Services";
import AuraService from "@/Services/AuraService";
import { getHost } from "@/Services/Host";
import type { OverviewId, OverviewResponse } from "@LAF/Pages/Bribes/Models";

const auraService = new AuraService(getHost());

export default class DashboardService extends ServiceBase {
  public async getOverview(overviewId: OverviewId): Promise<OverviewResponse> {
    const request = this.fetch<OverviewResponse>(`${this.host}/dashboard`, {
      id: overviewId,
    });
    if (overviewId === "bribes-overview-aura") {
      return getMergeWithHiddenHands(request, auraService.getOverview());
    }
    return request;
  }
}
