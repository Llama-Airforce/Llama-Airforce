import type { OverviewResponse } from "@LAF/Pages/Bribes/Models";

export const AuraConstants = {
  HH_API_URL: "https://api.hiddenhand.finance/proposal/aura",
  LA_API_URL: "https://llama-airforce-api.aura.finance/dollar-per-vlasset",
  START_ROUND: 28,
  START_DATE: 1689019200,
  BIWEEKLY: 86_400 * 14,
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

function getOffset(days?: number, hours?: number) {
  return 86_400 * (days ?? 0) + 3600 * (hours ?? 0);
}

export function getStartDateForRound(round: number) { 
  const { START_DATE, BIWEEKLY, START_ROUND } = AuraConstants;
  const offset = getOffset(5, -4);
  const roundsSinceStart = round - START_ROUND;
  return START_DATE - offset + (roundsSinceStart * BIWEEKLY)
}

export function getEndDateForRound(round: number) {
  const offset = getOffset(5); // 5 day period
  return getStartDateForRound(round) + offset; 
}

export function getLatestAuraRound(today: number): number {
  const { START_DATE, BIWEEKLY, START_ROUND } = AuraConstants;
  const offset = getOffset(9, 4);
  const len = Math.ceil((today - START_DATE - offset) / BIWEEKLY);
  return START_ROUND + len;
}
