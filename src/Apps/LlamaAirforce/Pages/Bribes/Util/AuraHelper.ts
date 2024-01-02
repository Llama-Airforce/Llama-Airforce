import type { OverviewResponse } from "@/Apps/LlamaAirforce/Pages/Bribes/Models";

// Helper to merge HH data
export function getMergeWithHiddenHands(
  baseRequest: Promise<OverviewResponse>,
  newRequest: Promise<OverviewResponse>
) {
  return Promise.all([baseRequest, newRequest]).then(
    ([baseResponse, newResponse]) => {
      if (!baseResponse.dashboard || !newResponse.dashboard)
        return { success: false };
      const epochs = [
        ...baseResponse.dashboard.epochs,
        ...newResponse.dashboard.epochs,
      ];
      return {
        ...baseResponse,
        dashboard: {
          ...baseResponse.dashboard,
          epochs,
        },
      };
    }
  );
}
