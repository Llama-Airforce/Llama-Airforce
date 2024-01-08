import type { OverviewResponse } from "@LAF/Pages/Bribes/Models";

export const AuraConstants = {
  HH_API_URL: "https://api.hiddenhand.finance/proposal/aura",
  LA_API_URL: "https://llama-airforce-api.aura.finance/dollar-per-vlasset",
  START_ROUND: 28,
  START_DATE: 1689019200,
  BIWEEKLY: 60 * 60 * 24 * 14,
};

// Helper to merge HH data
export function getMergeWithHiddenHands(
  baseRequest: Promise<OverviewResponse>,
  newRequest: Promise<OverviewResponse>
) {
  return Promise.all([baseRequest, newRequest]).then(
    ([baseResponse, newResponse]) => {
      if (!baseResponse.dashboard || !newResponse.dashboard) {
        return { success: false };
      }
      const epochs = [
        ...baseResponse.dashboard.epochs,
        ...newResponse.dashboard.epochs,
      ];
      return {
        ...baseResponse,
        dashboard: {
          ...baseResponse.dashboard,
          rewardPerDollarBribe: newResponse.dashboard?.rewardPerDollarBribe,
          epochs,
        },
      };
    }
  );
}

export function getLatestAuraRound(): number {
  const { START_DATE, BIWEEKLY, START_ROUND } = AuraConstants;
  const today = Math.floor(Date.now() / 1000);
  const len = Math.ceil((today - START_DATE) / BIWEEKLY);
  return START_ROUND + len;
}
