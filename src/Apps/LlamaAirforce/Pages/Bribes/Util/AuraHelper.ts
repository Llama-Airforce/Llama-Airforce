import type { OverviewResponse } from "@LAF/Pages/Bribes/Models";

export const AuraConstants = {
  HH_API_URL: "https://api.hiddenhand.finance/proposal/aura",
  LA_API_URL: "https://llama-airforce-api.aura.finance/dollar-per-vlasset",
  START_ROUND: 28,
  START_DATE: 1689019200,
  BIWEEKLY: 86_400 * 14,
  OFFSET: 86_400 * (14 - 5), // 5 day vote period within 14
};

// Helper to merge HH data
export function getMergeWithHiddenHands(
  baseResponse: OverviewResponse,
  newResponse: OverviewResponse
) {
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

export function getLatestAuraRound(today: number): number {
  const { START_DATE, BIWEEKLY, START_ROUND, OFFSET } = AuraConstants;
  const len = Math.ceil((today - START_DATE - OFFSET) / BIWEEKLY);
  return START_ROUND + len;
}
